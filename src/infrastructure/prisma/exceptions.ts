import { Code } from "../../shared/utils/http_code";

/** Prisma-known request errors have a string .code like P2003. Detect by shape to avoid importing Prisma in shared. */
export function isPrismaKnownRequestError(err: unknown): err is Error & { code: string; meta?: unknown } {
  return (
    err instanceof Error &&
    typeof (err as Error & { code?: string }).code === "string" &&
    /^P\d+$/.test((err as Error & { code: string }).code)
  );
}

/** Payload attached to DriverAdapterError.cause (see @prisma/adapter-pg mapDriverError). */
function getDriverAdapterCause(driverAdapterError: unknown): Record<string, unknown> | null {
  if (driverAdapterError == null || typeof driverAdapterError !== "object") return null;
  const inner = (driverAdapterError as { cause?: unknown }).cause;
  if (inner == null || typeof inner !== "object") return null;
  return inner as Record<string, unknown>;
}

/**
 * Postgres / Prisma often name FKs `{table}_{column}_fkey` with a single-segment table name (e.g. customers_category_id_fkey → category_id).
 * If the table name contains underscores, we fall back to the whole name without _fkey.
 */
function fieldHintFromForeignKeyConstraintName(constraintName: string): string {
  const base = constraintName.replace(/_fkey$/i, "");
  const m = /^([a-z][a-z0-9]*)_(.+)$/i.exec(base);
  if (m?.[2]) return m[2];
  return base;
}

function constraintFieldFromAdapterCause(adapterCause: Record<string, unknown>): string | null {
  const constraint = adapterCause.constraint as Record<string, unknown> | undefined;
  if (!constraint) return null;

  const fields = constraint.fields;
  if (Array.isArray(fields) && fields.length > 0) {
    return (fields as unknown[]).map(String).join(", ");
  }

  const index = constraint.index;
  if (typeof index === "string" && index) {
    const kind = adapterCause.kind;
    if (kind === "ForeignKeyConstraintViolation") {
      return fieldHintFromForeignKeyConstraintName(index);
    }
    return index;
  }

  return null;
}

/** Prisma engine message often includes: Foreign key constraint violated on the constraint: `name` */
function fieldHintFromPrismaEngineMessage(message: string): string | null {
  const quoted = message.match(/constraint:\s*`([^`]+)`/i)?.[1];
  if (!quoted) return null;
  if (/_fkey$/i.test(quoted)) return fieldHintFromForeignKeyConstraintName(quoted);
  return quoted;
}

/**
 * Extract field/column name(s) from Prisma error meta (P2002: target; P2003: field_name;
 * Prisma 7 + driver adapter: driverAdapterError.cause.constraint).
 */
export function getPrismaErrorField(meta: unknown, engineMessage?: string): string | null {
  if (meta != null && typeof meta === "object") {
    const m = meta as Record<string, unknown>;

    if (Array.isArray(m.target) && m.target.length > 0) {
      return (m.target as unknown[]).map(String).join(", ");
    }
    if (typeof m.field_name === "string" && m.field_name) {
      return m.field_name.replace(/_fkey.*$/i, "").trim() || m.field_name;
    }

    const adapterCause = getDriverAdapterCause(m.driverAdapterError);
    if (adapterCause) {
      const fromAdapter = constraintFieldFromAdapterCause(adapterCause);
      if (fromAdapter) return fromAdapter;
    }
  }

  if (engineMessage) {
    return fieldHintFromPrismaEngineMessage(engineMessage);
  }

  return null;
}

export function prismaErrorToHttpPayload(
  err: Error & { code: string; meta?: unknown },
): { statusCode: number; message: string } {
  const code = err.code;
  const field = getPrismaErrorField(err.meta, err.message);

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
