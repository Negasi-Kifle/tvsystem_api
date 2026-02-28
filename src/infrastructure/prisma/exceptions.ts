import { Code } from "../../shared/utils/http_code";

/** Prisma-known request errors have a string .code like P2003. Detect by shape to avoid importing Prisma in shared. */
export function isPrismaKnownRequestError(err: unknown): err is Error & { code: string; meta?: unknown } {
    return (
      err instanceof Error &&
      typeof (err as Error & { code?: string }).code === "string" &&
      /^P\d+$/.test((err as Error & { code: string }).code)
    );
  }
  
  /** Extract field/column name(s) from Prisma error meta (P2002: target, P2003: field_name; Prisma 7: driverAdapterError). */
  export function getPrismaErrorField(meta: unknown): string | null {
    if (meta == null || typeof meta !== "object") return null;
    const m = meta as Record<string, unknown>;
    if (Array.isArray(m.target) && m.target.length > 0) {
      const names = (m.target as unknown[]).map(String).join(", ");
      return names;
    }
    if (typeof m.field_name === "string" && m.field_name) {
      return m.field_name.replace(/_fkey.*$/i, "").trim() || m.field_name;
    }
    const cause = m.driverAdapterError as Record<string, unknown> | undefined;
    const constraint = cause?.cause as Record<string, unknown> | undefined;
    const constraintObj = constraint?.constraint as Record<string, unknown> | undefined;
    const fields = constraintObj?.fields;
    if (Array.isArray(fields) && fields.length > 0) {
      return (fields as unknown[]).map(String).join(", ");
    }
    if (typeof constraint?.field_name === "string") return constraint.field_name as string;
    return null;
  }
  
  export function prismaErrorToHttpPayload(err: Error & { code: string; meta?: unknown }): { statusCode: number; message: string } {
    const code = err.code;
    const field = getPrismaErrorField(err.meta);
    const fieldSuffix = field ? ` Field: ${field}.` : "";
    switch (code) {
      case "P2002":
        return {
          statusCode: Code.ENTITY_ALREADY_EXISTS_ERROR.code,
          message: `A record with this value already exists.${fieldSuffix}`,
        };
      case "P2003":
        return {
          statusCode: Code.BAD_REQUEST_ERROR.code,
          message: `Referenced record does not exist. Check the related field.${fieldSuffix}`,
        };
      case "P2025":
        return { statusCode: Code.ENTITY_NOT_FOUND_ERROR.code, message: "Record not found." };
      default:
        return {
          statusCode: Code.BAD_REQUEST_ERROR.code,
          message: err.message ? `${err.message}.${fieldSuffix}` : `Database constraint or request error.${fieldSuffix}`,
        };
    }
  }