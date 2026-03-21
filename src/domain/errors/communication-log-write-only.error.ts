export class CommunicationLogWriteOnlyError extends Error {
  constructor(message = 'Communication log entries are write-only and cannot be updated or deleted') {
    super(message);
    this.name = 'CommunicationLogWriteOnlyError';
  }
}
