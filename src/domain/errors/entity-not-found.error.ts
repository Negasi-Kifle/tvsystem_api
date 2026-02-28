/**
 * Application-layer error for "entity not found" cases.
 * No HTTP concepts — presentation layer maps this to 404.
 */
export class EntityNotFoundError extends Error {
  constructor(
    message: string,
    public readonly entityName?: string,
    public readonly identifier?: string
  ) {
    super(message);
    this.name = 'EntityNotFoundError';
    Error.captureStackTrace(this, this.constructor);
  }
}
