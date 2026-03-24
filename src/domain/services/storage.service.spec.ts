import {
  extractUploadRelativePathFromPublicUrl,
  normalizeBaseUrl,
} from './storage.service';

describe('normalizeBaseUrl', () => {
  it('trims trailing slashes', () => {
    expect(normalizeBaseUrl('http://localhost:3000/')).toBe('http://localhost:3000');
    expect(normalizeBaseUrl('http://localhost:3000///')).toBe('http://localhost:3000');
  });
});

describe('extractUploadRelativePathFromPublicUrl', () => {
  it('returns relative uploads path when URL matches base', () => {
    expect(
      extractUploadRelativePathFromPublicUrl(
        'http://localhost:3000/uploads/advert-packages/x.webp',
        'http://localhost:3000',
      ),
    ).toBe('uploads/advert-packages/x.webp');
  });

  it('returns null for wrong base', () => {
    expect(
      extractUploadRelativePathFromPublicUrl(
        'http://other/uploads/advert-packages/x.webp',
        'http://localhost:3000',
      ),
    ).toBeNull();
  });

  it('returns null for non-uploads path', () => {
    expect(
      extractUploadRelativePathFromPublicUrl('http://localhost:3000/api/foo', 'http://localhost:3000'),
    ).toBeNull();
  });

  it('returns null for path traversal in URL', () => {
    expect(
      extractUploadRelativePathFromPublicUrl(
        'http://localhost:3000/uploads/../etc/passwd',
        'http://localhost:3000',
      ),
    ).toBeNull();
  });
});
