

export class EntityAlreadyExistsError extends Error {
  constructor(
    message: string,
    public readonly entityName?: string,
    public readonly identifier?: string
  ) {
    super(message);
    this.name = 'EntityAlreadyExistsError';
    Error.captureStackTrace(this, this.constructor);
  }
}