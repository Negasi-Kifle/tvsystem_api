/** Base URL for SPA links in emails (password reset, compensation). No trailing slash. */
export function getPublicAppUrlOrThrow(): string {
  const url = process.env.PUBLIC_APP_URL?.trim() || process.env.FRONTEND_URL?.trim();
  if (!url) {
    throw new Error('PUBLIC_APP_URL or FRONTEND_URL must be set for email links');
  }
  return url.replace(/\/+$/, '');
}
