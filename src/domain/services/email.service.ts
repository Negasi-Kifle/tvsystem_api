export type EmailAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

export interface IEmailService {
  send(to: string, subject: string, body: string, attachments?: EmailAttachment[]): Promise<void>;
}
