export interface EmailServiceInterface {
  send(to: string, subject: string, body: string): Promise<void>;
}
