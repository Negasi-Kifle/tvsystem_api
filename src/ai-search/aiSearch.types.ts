import { z } from 'zod';

const ContactItemSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

/**
 * Normal API row shape (after normalization). No `z.preprocess` — safe for
 * re-validation in tests and responses.
 */
export const ProspectSchema = z.object({
  name: z.string().min(1),
  website: z.string().nullable(),
  industry: z.string().nullable(),
  location: z.string().nullable(),
  contacts: z.array(ContactItemSchema).max(20),
  source: z.string().min(1),
  confidenceScore: z.number().min(0).max(1),
  reason: z.string().min(1),
});

export type Prospect = z.infer<typeof ProspectSchema>;

export const ProspectListSchema = z.array(ProspectSchema).max(15);

/**
 * Strict shape for `generateObject` / OpenAI structured output.
 * Must NOT use `z.preprocess` (breaks zod-to-json-schema for many providers).
 */
export const ProspectLlmSchema = z.object({
  name: z.string().min(1),
  website: z.union([z.string().min(1), z.null()]).optional(),
  industry: z.union([z.string(), z.null()]).optional(),
  location: z.union([z.string(), z.null()]).optional(),
  contacts: z.array(ContactItemSchema).max(20).optional(),
  source: z.string().min(1),
  confidenceScore: z.number().min(0).max(1),
  reason: z.string().min(1),
});

export const ProspectsLlmEnvelopeSchema = z.object({
  prospects: z.array(ProspectLlmSchema).max(15),
});

/**
 * Relaxed shape for the text + `JSON.parse` fallback (string scores, messy fields).
 */
export const ProspectCoercedSchema = z.object({
  name: z.string().min(1),
  website: z.unknown().optional(),
  industry: z.unknown().optional(),
  location: z.unknown().optional(),
  contacts: z.unknown().optional(),
  source: z.string().min(1),
  confidenceScore: z.coerce.number().min(0).max(1),
  reason: z.string().min(1),
});

export const ProspectsCoercedEnvelopeSchema = z.object({
  prospects: z.array(ProspectCoercedSchema).max(15),
});

export type ProspectLlm = z.infer<typeof ProspectLlmSchema>;

export function normalizeLlmToProspect(p: ProspectLlm): Prospect {
  const strOrNull = (v: string | null | undefined): string | null => {
    if (v == null) return null;
    const s = String(v).trim();
    return s === '' ? null : s;
  };
  return {
    name: p.name.trim(),
    website: strOrNull(p.website === undefined ? null : p.website),
    industry: strOrNull(p.industry as string | null | undefined),
    location: strOrNull(p.location as string | null | undefined),
    contacts: Array.isArray(p.contacts) ? p.contacts : [],
    source: p.source,
    confidenceScore: p.confidenceScore,
    reason: p.reason,
  };
}

function normalizeStringish(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s === '' ? null : s;
}

export function normalizeCoercedToProspect(p: z.infer<typeof ProspectCoercedSchema>): Prospect {
  const contacts: Prospect['contacts'] = Array.isArray(p.contacts)
    ? p.contacts.map((c) => {
        if (c == null || typeof c !== 'object') return {};
        const o = c as Record<string, unknown>;
        return {
          name: o.name != null ? String(o.name) : undefined,
          email: o.email != null ? String(o.email) : undefined,
          phone: o.phone != null ? String(o.phone) : undefined,
        };
      })
    : [];
  return {
    name: p.name.trim(),
    website: normalizeStringish(p.website),
    industry: normalizeStringish(p.industry),
    location: normalizeStringish(p.location),
    contacts,
    source: p.source,
    confidenceScore: p.confidenceScore,
    reason: p.reason,
  };
}

export const aiSearchBodySchema = z
  .object({
    query: z.string().min(3).max(1000).trim(),
  })
  .strict();

export type AiSearchRequestBody = z.infer<typeof aiSearchBodySchema>;

export type SearchResultItem = {
  title: string;
  url: string;
  snippet: string;
};

export type SearchProviderId = 'tavily' | 'serpapi';
