import { generateObject, generateText, tool, stepCountIs } from 'ai';
import { z } from 'zod';
import type { LanguageModel } from 'ai';
import { Exception } from '../shared/utils/error-constructor';
import { Code } from '../shared/utils/http_code';
import {
  getPhaseASystemPrompt,
  getPhaseBRepairSystemPrompt,
  getPhaseBSystemPrompt,
} from './aiSearch.prompt';
import {
  type Prospect,
  type SearchProviderId,
  type SearchResultItem,
  ProspectsCoercedEnvelopeSchema,
  ProspectsLlmEnvelopeSchema,
  normalizeCoercedToProspect,
  normalizeLlmToProspect,
} from './aiSearch.types';

// TODO: In deployment, set SEARCH_PROVIDER, TAVILY_API_KEY and/or SERPAPI_API_KEY; optional: AI_SEARCH_MODEL, AI_SEARCH_TIMEOUT_MS (see also TODO.md).

const MAX_PROSPECTS = 15;
const TOOL_STEPS = 6;

const BLOG_PATTERNS = /\/(blog|tag|category|author)\b/i;

const TAVILY_URL = 'https://api.tavily.com/search';
/** curl-like UA: many CDNs allow it; custom app UAs are often blocked. */
const TAVILY_UA_CURL = 'curl/8.5.0';
const TAVILY_UA_BROWSER =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

/**
 * Strips common .env mistakes: `Bearer <key>` when we add another Bearer,
 * and wrapping quotes. Exported for unit tests.
 */
export function normalizeTavilyApiKey(raw: string): string {
  let k = raw.trim();
  if ((k.startsWith('"') && k.endsWith('"')) || (k.startsWith("'") && k.endsWith("'"))) {
    k = k.slice(1, -1).trim();
  }
  if (k.toLowerCase().startsWith('bearer ')) {
    k = k.slice(7).trim();
  }
  return k;
}

function tavilyErrorMessage(data: unknown, rawText: string, status: number): string {
  if (data == null || typeof data !== 'object') {
    return rawText.slice(0, 400) || `HTTP ${status}`;
  }
  const o = data as Record<string, unknown>;
  if (typeof o.error === 'string' && o.error) return o.error;
  const detail = o.detail;
  if (typeof detail === 'string' && detail) return detail;
  if (detail && typeof detail === 'object' && 'error' in detail) {
    const e = (detail as { error?: unknown }).error;
    if (typeof e === 'string') return e;
  }
  return JSON.stringify(detail ?? o).slice(0, 400) || `HTTP ${status}`;
}

function tavilyHeadersJson(ua: string, browserExtras: boolean): Record<string, string> {
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
    'User-Agent': ua,
  };
  if (browserExtras) {
    h['Accept-Language'] = 'en-US,en;q=0.9';
  }
  return h;
}

function isProbablyJson(s: string): boolean {
  const t = s.trim();
  return t.startsWith('{') || t.startsWith('[');
}

function isHtmlResponse(s: string): boolean {
  const t = s.trim().toLowerCase();
  return t.startsWith('<!') || t.startsWith('<html') || t.includes('<html');
}

function tavilyNonJsonBodyHint(status: number, raw: string): string {
  if (isHtmlResponse(raw)) {
    return `HTTP ${status} returned an HTML error page (edge/WAF), not the Tavily JSON API. This often happens on VPNs, some cloud or datacenter IPs, or strict networks. Try another network, turn off VPN, or run the API from a host that can reach https://api.tavily.com (see also NODE_OPTIONS=--dns-result-order=ipv4first if you suspect IPv6 issues).`;
  }
  return raw.slice(0, 200);
}

/** Pulls a JSON object from model text (handles ```json fences and leading prose). */
function extractJsonObjectString(text: string): string {
  let t = text.trim();
  const fenced = /^```(?:json)?\s*([\s\S]*?)```$/im.exec(t);
  if (fenced?.[1]) t = fenced[1].trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start >= 0 && end > start) return t.slice(start, end + 1);
  return t;
}

export function normalizeCompanyName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b(plc|ltd|limited|l\.l\.c|llc|inc|corp|corporation|s\.a|sa|nv|bv|gmbh|co)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractHostname(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Dedupe by normalized name and by company website host (avoids collapsing different orgs on shared social/directory hosts).
 */
export function deduplicateProspects(sortedByConfidence: Prospect[]): Prospect[] {
  const seenNames = new Set<string>();
  const seenWebsiteHosts = new Set<string>();
  const out: Prospect[] = [];

  for (const p of sortedByConfidence) {
    const nKey = normalizeCompanyName(p.name);
    if (seenNames.has(nKey)) continue;

    const siteHost = extractHostname(p.website);
    if (siteHost && seenWebsiteHosts.has(siteHost)) continue;

    seenNames.add(nKey);
    if (siteHost) seenWebsiteHosts.add(siteHost);
    out.push(p);
  }

  return out;
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

export function applyRankingHeuristics(p: Prospect): Prospect {
  let score = p.confidenceScore;
  const website = p.website ?? '';
  if (website.startsWith('https://') && !website.includes('facebook.com') && !website.includes('linkedin.com')) {
    score += 0.03;
  }
  if (BLOG_PATTERNS.test(p.source)) {
    score -= 0.05;
  }
  return { ...p, confidenceScore: clamp01(score) };
}

/**
 * Tavily: Bearer + `api_key` in body. We try several header profiles because
 * some networks return HTML 403 (edge/WAF) for uncommon User-Agents; curl- and
 * browser-like UAs and JSON Accept often succeed where custom app UAs fail.
 */
async function searchTavily(
  query: string,
  apiKey: string,
  signal: AbortSignal,
): Promise<SearchResultItem[]> {
  const key = normalizeTavilyApiKey(apiKey);
  if (!key) {
    throw new Error('Tavily: TAVILY_API_KEY is empty or invalid (check for quotes/whitespace in .env).');
  }

  const bodyStr = JSON.stringify({
    query,
    search_depth: 'basic' as const,
    max_results: 10,
    include_answer: false,
    api_key: key,
  });

  const attempts: Array<{
    label: string;
    headers: Record<string, string>;
  }> = [
    { label: 'bearer+curl-ua', headers: { ...tavilyHeadersJson(TAVILY_UA_CURL, false), Authorization: `Bearer ${key}` } },
    { label: 'bodyKey+curl-ua', headers: tavilyHeadersJson(TAVILY_UA_CURL, false) },
    { label: 'bearer+browser-ua', headers: { ...tavilyHeadersJson(TAVILY_UA_BROWSER, true), Authorization: `Bearer ${key}` } },
    { label: 'bodyKey+browser-ua', headers: tavilyHeadersJson(TAVILY_UA_BROWSER, true) },
  ];

  let lastStatus = 0;
  let lastText = '';
  for (const att of attempts) {
    const res = await fetch(TAVILY_URL, {
      method: 'POST',
      headers: att.headers,
      body: bodyStr,
      signal,
    });
    lastText = await res.text();
    lastStatus = res.status;
    const jsonOk = isProbablyJson(lastText);

    if (res.ok && jsonOk) {
      let data: {
        results?: Array<{ title?: string; url?: string; content?: string }>;
        error?: string;
        detail?: unknown;
      };
      try {
        data = JSON.parse(lastText) as typeof data;
      } catch {
        continue;
      }
      const results = data.results ?? [];
      if (data.error && results.length === 0) {
        throw new Error(`Tavily: ${data.error}`);
      }
      return results.map((r) => ({
        title: r.title ?? '',
        url: r.url ?? '',
        snippet: r.content ?? '',
      }));
    }

    if (res.status === 400 && jsonOk) {
      let data: unknown;
      try {
        data = JSON.parse(lastText);
      } catch {
        throw new Error(`Tavily HTTP 400: ${lastText.slice(0, 200)}`);
      }
      throw new Error(`Tavily HTTP 400: ${tavilyErrorMessage(data, lastText, 400)}`);
    }

    if (jsonOk) {
      let data: { results?: unknown; error?: string; detail?: unknown };
      try {
        data = JSON.parse(lastText) as { results?: unknown; error?: string; detail?: unknown };
      } catch {
        continue;
      }
      if (!res.ok) {
        throw new Error(
          `Tavily HTTP ${res.status}: ${tavilyErrorMessage(data, lastText, res.status)}`,
        );
      }
    }
    if ((res.status === 401 || res.status === 403) && !jsonOk) {
      continue;
    }
    if (!jsonOk) {
      continue;
    }
  }

  if (isHtmlResponse(lastText)) {
    throw new Error(`Tavily: ${tavilyNonJsonBodyHint(lastStatus, lastText)}`);
  }
  try {
    const data = JSON.parse(lastText) as unknown;
    throw new Error(
      `Tavily HTTP ${lastStatus}: ${tavilyErrorMessage(data, lastText, lastStatus)}`,
    );
  } catch (e) {
    if (e instanceof Error && e.message.startsWith('Tavily HTTP')) throw e;
  }
  throw new Error(
    `Tavily: could not get JSON from ${TAVILY_URL} (last HTTP ${lastStatus}). ${tavilyNonJsonBodyHint(lastStatus, lastText)}`,
  );
}

async function searchSerpApi(
  query: string,
  apiKey: string,
  signal: AbortSignal,
): Promise<SearchResultItem[]> {
  const u = new URL('https://serpapi.com/search.json');
  u.searchParams.set('engine', 'google');
  u.searchParams.set('q', query);
  u.searchParams.set('api_key', apiKey.trim());
  const res = await fetch(u.toString(), { signal });
  const rawText = await res.text();
  let data: {
    organic_results?: Array<{ title?: string; link?: string; snippet?: string }>;
    error?: string;
  };
  try {
    data = JSON.parse(rawText) as typeof data;
  } catch {
    throw new Error(`SerpAPI: invalid response (HTTP ${res.status}) ${rawText.slice(0, 200)}`);
  }
  if (data.error) {
    throw new Error(`SerpAPI: ${data.error}`);
  }
  if (!res.ok) {
    throw new Error(`SerpAPI HTTP ${res.status}: ${rawText.slice(0, 200)}`);
  }
  return (data.organic_results ?? []).map((r) => ({
    title: r.title ?? '',
    url: r.link ?? '',
    snippet: r.snippet ?? '',
  }));
}

/** Resolves `SEARCH_PROVIDER` (default tavily). Exposed for tests. */
export function getSearchProviderFromEnv(): SearchProviderId {
  const v = (process.env.SEARCH_PROVIDER ?? 'tavily').toLowerCase();
  if (v === 'tavily' || v === 'serpapi') return v;
  throw Exception.new({
    code: Code.BAD_REQUEST_ERROR,
    overrideMessage: `Invalid SEARCH_PROVIDER "${v}". Use "tavily" or "serpapi".`,
  });
}

function assertSearchKeys(provider: SearchProviderId): void {
  if (provider === 'tavily' && !normalizeTavilyApiKey(process.env.TAVILY_API_KEY ?? '')) {
    throw Exception.new({
      code: Code.INTERNAL_ERROR,
      overrideMessage: 'TAVILY_API_KEY is not set (required for SEARCH_PROVIDER=tavily).',
    });
  }
  if (provider === 'serpapi' && !process.env.SERPAPI_API_KEY?.trim()) {
    throw Exception.new({
      code: Code.INTERNAL_ERROR,
      overrideMessage: 'SERPAPI_API_KEY is not set (required for SEARCH_PROVIDER=serpapi).',
    });
  }
}

async function runSearch(
  provider: SearchProviderId,
  query: string,
  signal: AbortSignal,
): Promise<SearchResultItem[]> {
  if (provider === 'tavily') {
    return searchTavily(query, process.env.TAVILY_API_KEY as string, signal);
  }
  return searchSerpApi(query, process.env.SERPAPI_API_KEY as string, signal);
}

function formatSearchBlock(items: SearchResultItem[], query: string): string {
  if (items.length === 0) {
    return `Query "${query}": (no results)\n`;
  }
  const lines = items.map(
    (r, i) =>
      `  [${i + 1}] ${r.title}\n      URL: ${r.url}\n      Snippet: ${r.snippet.slice(0, 500)}${r.snippet.length > 500 ? '…' : ''}`,
  );
  return `Query "${query}":\n${lines.join('\n')}\n`;
}

const webSearchInputSchema = z.object({
  query: z.string().min(1).max(500).describe('Search query string'),
  reason: z.string().optional().describe('Why this search helps answer the user request'),
});

function buildTimeoutSignal(outer: AbortSignal | undefined): { signal: AbortSignal; isCombined: boolean } {
  const raw = process.env.AI_SEARCH_TIMEOUT_MS;
  const ms = raw ? Number(raw) : 120_000;
  if (!Number.isFinite(ms) || ms <= 0) {
    return { signal: outer ?? new AbortController().signal, isCombined: false };
  }
  const t = AbortSignal.timeout(ms);
  if (!outer) {
    return { signal: t, isCombined: true };
  }
  return { signal: AbortSignal.any([outer, t]), isCombined: true };
}

export class AiSearchService {
  constructor(private readonly model: LanguageModel) {}

  /**
   * Stateless prospect discovery: web search (tool) + structured extraction. Does not persist.
   */
  async searchProspects(userQuery: string, options: { signal?: AbortSignal } = {}): Promise<Prospect[]> {
    const { signal: runSignal } = buildTimeoutSignal(options.signal);
    const provider = getSearchProviderFromEnv();
    assertSearchKeys(provider);

    const researchChunks: string[] = [];
    let apiSuccessCount = 0;
    let apiErrorCount = 0;
    let toolCallCount = 0;
    let lastToolSearchError: string | undefined;

    const toolWebSearch = tool({
      description:
        'Search the public web for companies, news, and directory listings. Use focused queries. Returns top results with title, URL, and snippet.',
      inputSchema: webSearchInputSchema,
      execute: async (input) => {
        toolCallCount += 1;
        let items: SearchResultItem[] = [];
        try {
          items = await runSearch(provider, input.query, runSignal);
          apiSuccessCount += 1;
        } catch (e) {
          apiErrorCount += 1;
          const message = e instanceof Error ? e.message : String(e);
          lastToolSearchError = message;
          researchChunks.push(`Query "${input.query}": TOOL_ERROR — ${message}\n`);
          return JSON.stringify({ error: true, message, query: input.query });
        }
        const block = formatSearchBlock(items, input.query);
        researchChunks.push(block);
        return JSON.stringify({
          resultCount: items.length,
          summary: block,
        });
      },
    });

    const isAbortLike = (e: unknown): boolean =>
      e instanceof Error &&
      (e.name === 'TimeoutError' ||
        e.name === 'AbortError' ||
        e.message === 'The operation was aborted' ||
        e.message.includes('aborted'));

    try {
      await generateText({
        model: this.model,
        system: getPhaseASystemPrompt(),
        prompt: `User prospecting request:\n${userQuery}\n\nSearch the web as needed, then stop.`,
        tools: { webSearch: toolWebSearch },
        stopWhen: stepCountIs(TOOL_STEPS),
        toolChoice: 'auto',
        abortSignal: runSignal,
        maxRetries: 1,
        temperature: 0.2,
      });
    } catch (e) {
      if (isAbortLike(e)) {
        throw Exception.new({
          code: { code: 504, message: 'Gateway timeout.' },
          overrideMessage: 'AI search request timed out.',
        });
      }
      if (researchChunks.length === 0) {
        throw e;
      }
    }

    if (apiSuccessCount === 0 && apiErrorCount > 0) {
      throw Exception.new({
        code: { code: 502, message: 'Search provider error.' },
        overrideMessage: lastToolSearchError
          ? `Web search failed: ${lastToolSearchError}`
          : 'Web search failed. Check SEARCH_PROVIDER and API keys, or try again later.',
      });
    }

    const evidence = researchChunks.join('\n---\n');
    const hasEvidence = evidence.trim().length > 0;
    if (!hasEvidence && toolCallCount > 0 && apiSuccessCount === 0) {
      throw Exception.new({
        code: { code: 502, message: 'Search provider error.' },
        overrideMessage: 'Web search returned no usable data.',
      });
    }

    const userBlock = hasEvidence
      ? `User request:\n${userQuery}\n\nWeb search evidence (only use these URLs as sources where applicable):\n${evidence}`
      : `User request:\n${userQuery}\n\nWeb search evidence: (none — return an empty array unless the request can be satisfied with no external results, which is unusual; prefer returning []).`;

    const runObjectGeneration = (system: string) =>
      generateObject({
        model: this.model,
        schema: ProspectsLlmEnvelopeSchema,
        schemaName: 'ProspectDiscovery',
        schemaDescription: 'Object with key prospects: B2B rows with sources from web evidence; max 15 items.',
        system,
        prompt: userBlock,
        abortSignal: runSignal,
        maxRetries: 2,
        temperature: 0.1,
        maxOutputTokens: 8192,
      });

    let lastPhaseBFailure = '';

    const tryPhaseBObject = async (repair: boolean): Promise<Prospect[] | null> => {
      try {
        const gen = await runObjectGeneration(
          repair ? getPhaseBRepairSystemPrompt() : getPhaseBSystemPrompt(),
        );
        const parsed = ProspectsLlmEnvelopeSchema.safeParse(gen.object);
        if (!parsed.success) {
          lastPhaseBFailure = parsed.error.issues.map((i) => i.message).join('; ') || 'envelope parse';
          return null;
        }
        return parsed.data.prospects.map(normalizeLlmToProspect);
      } catch (e) {
        lastPhaseBFailure = e instanceof Error ? e.message : String(e);
        return null;
      }
    };

    const tryPhaseBText = async (): Promise<Prospect[] | null> => {
      try {
        const system = `${getPhaseBSystemPrompt()}

You must output exactly one JSON object, no markdown fences, no commentary: {"prospects":[...]} with at most 15 items.`;
        const { text } = await generateText({
          model: this.model,
          system,
          prompt: userBlock,
          abortSignal: runSignal,
          maxRetries: 1,
          temperature: 0.1,
          maxOutputTokens: 8192,
        });
        const jsonStr = extractJsonObjectString(text);
        const json = JSON.parse(jsonStr) as unknown;
        const parsed = ProspectsCoercedEnvelopeSchema.safeParse(json);
        if (!parsed.success) {
          lastPhaseBFailure = parsed.error.issues.map((i) => i.path.join('.') + ': ' + i.message).join('; ');
          return null;
        }
        return parsed.data.prospects.map(normalizeCoercedToProspect);
      } catch (e) {
        lastPhaseBFailure = e instanceof Error ? e.message : String(e);
        return null;
      }
    };

    const listA = await tryPhaseBObject(false);
    const listB = listA ?? (await tryPhaseBObject(true));
    const listC = listB ?? (await tryPhaseBText());
    if (listC === null) {
      const debug = process.env.AI_SEARCH_DEBUG === '1' || process.env.AI_SEARCH_DEBUG === 'true';
      throw Exception.new({
        code: { code: 422, message: 'Unprocessable entity' },
        overrideMessage: debug
          ? `AI could not produce valid structured prospects. Last error: ${lastPhaseBFailure}`
          : 'AI could not produce valid structured prospects.',
      });
    }
    const list = listC;

    const adjusted = list.map(applyRankingHeuristics);
    adjusted.sort((a, b) => b.confidenceScore - a.confidenceScore);
    const deduped = deduplicateProspects(adjusted);
    return deduped.slice(0, MAX_PROSPECTS);
  }
}
