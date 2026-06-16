/** Default Ethiopian business directory hosts (domain only, no scheme). */
export const DEFAULT_BUSINESS_DIRECTORY_DOMAINS = ['businessguide.ezega.com'] as const;

/**
 * Normalizes a directory entry from env or config: strips scheme, path, www, lowercases host.
 */
export function normalizeDirectoryDomain(raw: string): string | null {
  let s = raw.trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) {
    try {
      s = new URL(s).hostname;
    } catch {
      s = s.replace(/^https?:\/\//i, '').split('/')[0] ?? s;
    }
  } else {
    s = s.split('/')[0] ?? s;
  }
  s = s.replace(/^www\./i, '').toLowerCase().trim();
  return s.length > 0 ? s : null;
}

/**
 * Resolves business directory domains from `AI_SEARCH_DIRECTORY_DOMAINS` (comma-separated)
 * or falls back to {@link DEFAULT_BUSINESS_DIRECTORY_DOMAINS}.
 */
export function getBusinessDirectoryDomainsFromEnv(): string[] {
  const raw = process.env.AI_SEARCH_DIRECTORY_DOMAINS?.trim();
  if (!raw) {
    return [...DEFAULT_BUSINESS_DIRECTORY_DOMAINS];
  }
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(',')) {
    const host = normalizeDirectoryDomain(part);
    if (host && !seen.has(host)) {
      seen.add(host);
      out.push(host);
    }
  }
  return out.length > 0 ? out : [...DEFAULT_BUSINESS_DIRECTORY_DOMAINS];
}
