import { beforeEach, afterEach, describe, expect, it } from '@jest/globals';
import {
  DEFAULT_BUSINESS_DIRECTORY_DOMAINS,
  getBusinessDirectoryDomainsFromEnv,
  normalizeDirectoryDomain,
} from '../../ai-search/aiSearch.directories';
import {
  applyRankingHeuristics,
  buildSerpApiQueryWithDomains,
  buildTavilySearchBody,
  deduplicateProspects,
  extractHostname,
  getSearchProviderFromEnv,
  normalizeCompanyName,
  normalizeTavilyApiKey,
} from '../../ai-search/aiSearch.service';
import { ProspectListSchema, ProspectSchema } from '../../ai-search/aiSearch.types';
import { Exception } from '../../shared/utils/error-constructor';

describe('normalizeTavilyApiKey', () => {
  it('strips Bearer prefix and quotes', () => {
    expect(normalizeTavilyApiKey('Bearer tvly-test-1')).toBe('tvly-test-1');
    expect(normalizeTavilyApiKey('"tvly-abc"')).toBe('tvly-abc');
  });
});

describe('normalizeCompanyName', () => {
  it('strips legal suffixes and lowercases', () => {
    expect(normalizeCompanyName('  Acme Manufacturing PLC  ')).toBe('acme manufacturing');
  });
});

describe('extractHostname', () => {
  it('removes www', () => {
    expect(extractHostname('https://www.example.com/path')).toBe('example.com');
  });

  it('returns null for invalid', () => {
    expect(extractHostname('not a url')).toBe(null);
  });
});

describe('deduplicateProspects', () => {
  it('keeps first by confidence order and drops same normalized name', () => {
    const list = [
      { name: 'Acme Plc', website: 'https://acme.com', source: 'https://news.test/a', reason: 'a', industry: 'X', location: 'Y', confidenceScore: 0.9, contacts: [] },
      { name: 'ACME Limited', website: 'https://other.com', source: 'https://news.test/b', reason: 'b', industry: 'X', location: 'Y', confidenceScore: 0.5, contacts: [] },
    ];
    const d = deduplicateProspects(list);
    expect(d).toHaveLength(1);
    expect(d[0]!.confidenceScore).toBe(0.9);
  });

  it('drops second row with same company website host (higher confidence kept first in list)', () => {
    const list = [
      { name: 'B', website: 'https://same.com/about', source: 'https://x.com/2', reason: 'b', industry: null, location: null, confidenceScore: 0.8, contacts: [] },
      { name: 'A', website: 'https://same.com', source: 'https://x.com/1', reason: 'a', industry: null, location: null, confidenceScore: 0.7, contacts: [] },
    ];
    const d = deduplicateProspects(list);
    expect(d).toHaveLength(1);
    expect(d[0]!.name).toBe('B');
  });
});

describe('normalizeDirectoryDomain', () => {
  it('strips scheme, path, and www', () => {
    expect(normalizeDirectoryDomain('https://www.businessguide.ezega.com/foo')).toBe(
      'businessguide.ezega.com',
    );
    expect(normalizeDirectoryDomain('businessguide.ezega.com')).toBe('businessguide.ezega.com');
  });

  it('returns null for empty', () => {
    expect(normalizeDirectoryDomain('  ')).toBe(null);
  });
});

describe('getBusinessDirectoryDomainsFromEnv', () => {
  const before = { ...process.env };

  beforeEach(() => {
    process.env = { ...before };
  });

  afterEach(() => {
    process.env = before;
  });

  it('defaults to Ezega when unset', () => {
    delete process.env.AI_SEARCH_DIRECTORY_DOMAINS;
    expect(getBusinessDirectoryDomainsFromEnv()).toEqual([...DEFAULT_BUSINESS_DIRECTORY_DOMAINS]);
  });

  it('parses comma-separated hosts and URLs', () => {
    process.env.AI_SEARCH_DIRECTORY_DOMAINS =
      'https://businessguide.ezega.com/, https://www.other.et/path';
    expect(getBusinessDirectoryDomainsFromEnv()).toEqual([
      'businessguide.ezega.com',
      'other.et',
    ]);
  });

  it('dedupes entries', () => {
    process.env.AI_SEARCH_DIRECTORY_DOMAINS =
      'businessguide.ezega.com,www.businessguide.ezega.com';
    expect(getBusinessDirectoryDomainsFromEnv()).toEqual(['businessguide.ezega.com']);
  });
});

describe('buildSerpApiQueryWithDomains', () => {
  it('returns query unchanged when no domains', () => {
    expect(buildSerpApiQueryWithDomains('hotels Addis', [])).toBe('hotels Addis');
  });

  it('prepends single site: filter', () => {
    expect(buildSerpApiQueryWithDomains('hotels', ['businessguide.ezega.com'])).toBe(
      'site:businessguide.ezega.com hotels',
    );
  });

  it('prepends OR site: clause for multiple domains', () => {
    expect(
      buildSerpApiQueryWithDomains('manufacturing', ['a.com', 'b.et']),
    ).toBe('(site:a.com OR site:b.et) manufacturing');
  });
});

describe('buildTavilySearchBody', () => {
  it('includes include_domains when provided', () => {
    const body = JSON.parse(
      buildTavilySearchBody('query', 'tvly-key', ['businessguide.ezega.com']),
    ) as { include_domains?: string[] };
    expect(body.include_domains).toEqual(['businessguide.ezega.com']);
  });

  it('omits include_domains when empty', () => {
    const body = JSON.parse(buildTavilySearchBody('query', 'tvly-key')) as Record<string, unknown>;
    expect(body.include_domains).toBeUndefined();
  });
});

describe('applyRankingHeuristics', () => {
  it('boosts https corporate site slightly', () => {
    const p = applyRankingHeuristics({
      name: 'Co',
      website: 'https://co.com',
      source: 'https://news.org/a',
      reason: 'r',
      industry: 'i',
      location: 'l',
      confidenceScore: 0.5,
      contacts: [],
    });
    expect(p.confidenceScore).toBeGreaterThan(0.5);
  });

  it('boosts directory source URLs slightly', () => {
    const hosts = new Set(['businessguide.ezega.com']);
    const p = applyRankingHeuristics(
      {
        name: 'Co',
        website: null,
        source: 'https://businessguide.ezega.com/listing/1',
        reason: 'r',
        industry: 'i',
        location: 'l',
        confidenceScore: 0.5,
        contacts: [],
      },
      hosts,
    );
    expect(p.confidenceScore).toBe(0.52);
  });
});

describe('ProspectListSchema', () => {
  it('accepts a valid list', () => {
    const data = {
      name: 'Test Co',
      website: 'https://test.com',
      industry: 'Mfg',
      location: 'Addis Ababa',
      contacts: [{ email: 'a@b.com' }],
      source: 'https://source.test/x',
      confidenceScore: 0.75,
      reason: 'Mentioned in directory',
    };
    const r = ProspectListSchema.safeParse([data]);
    expect(r.success).toBe(true);
  });

  it('rejects out-of-range confidence', () => {
    const r = ProspectSchema.safeParse({
      name: 'X',
      website: null,
      industry: null,
      location: null,
      contacts: [],
      source: 'https://a.com',
      confidenceScore: 1.2,
      reason: 'nope',
    });
    expect(r.success).toBe(false);
  });
});

describe('getSearchProviderFromEnv', () => {
  const before = { ...process.env };

  beforeEach(() => {
    process.env = { ...before };
  });

  afterEach(() => {
    process.env = before;
  });

  it('defaults to tavily', () => {
    delete process.env.SEARCH_PROVIDER;
    expect(getSearchProviderFromEnv()).toBe('tavily');
  });

  it('reads serpapi', () => {
    process.env.SEARCH_PROVIDER = 'serpapi';
    expect(getSearchProviderFromEnv()).toBe('serpapi');
  });

  it('throws Exception for invalid value', () => {
    process.env.SEARCH_PROVIDER = 'bing';
    expect(() => getSearchProviderFromEnv()).toThrow(Exception);
  });
});
