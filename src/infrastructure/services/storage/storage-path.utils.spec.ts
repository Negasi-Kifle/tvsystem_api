import {
  ALLOWED_IMAGE_MIME_TYPES,
  sanitizeOriginalFilename,
  sanitizeStorageFolder,
} from './storage-path.utils';

describe('sanitizeStorageFolder', () => {
  it('accepts advert-packages', () => {
    expect(sanitizeStorageFolder('advert-packages')).toBe('advert-packages');
  });

  it('defaults to misc when undefined', () => {
    expect(sanitizeStorageFolder(undefined)).toBe('misc');
  });

  it('lowercases folder', () => {
    expect(sanitizeStorageFolder('My-Folder')).toBe('my-folder');
  });

  it('rejects path traversal', () => {
    expect(() => sanitizeStorageFolder('../etc')).toThrow('Invalid storage folder');
    expect(() => sanitizeStorageFolder('a/b')).toThrow('Invalid storage folder');
  });

  it('rejects invalid characters', () => {
    expect(() => sanitizeStorageFolder('foo_bar')).toThrow('Invalid storage folder');
  });
});

describe('sanitizeOriginalFilename', () => {
  it('strips directory components', () => {
    expect(sanitizeOriginalFilename('../../../etc/passwd')).toBe('passwd');
  });

  it('replaces unsafe characters', () => {
    expect(sanitizeOriginalFilename('my photo (1).jpg')).toContain('.jpg');
    expect(sanitizeOriginalFilename('my photo (1).jpg')).not.toMatch(/[()]/);
  });

  it('uses fallback when empty after sanitization', () => {
    expect(sanitizeOriginalFilename('...')).toBe('file');
  });
});

describe('ALLOWED_IMAGE_MIME_TYPES', () => {
  it('contains jpeg png webp only', () => {
    expect(ALLOWED_IMAGE_MIME_TYPES.has('image/jpeg')).toBe(true);
    expect(ALLOWED_IMAGE_MIME_TYPES.has('image/png')).toBe(true);
    expect(ALLOWED_IMAGE_MIME_TYPES.has('image/webp')).toBe(true);
    expect(ALLOWED_IMAGE_MIME_TYPES.has('image/gif')).toBe(false);
  });
});
