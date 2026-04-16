import { Exception } from "../utils/error-constructor";
import { Code } from "../utils/http_code";

/** Base URL for SPA links in emails (password reset, compensation). No trailing slash. */
export function getPublicAppUrlOrThrow(): string {
  const url = process.env.PUBLIC_APP_URL?.trim() || process.env.FRONTEND_URL?.trim();
  if (!url) {
    throw Exception.new({
      code: Code.BAD_REQUEST_ERROR,
      overrideMessage: 'PUBLIC_APP_URL or FRONTEND_URL must be set for email links',
    });
  }
  return url.replace(/\/+$/, '');
}
