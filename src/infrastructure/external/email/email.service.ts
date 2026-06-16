import nodemailer from 'nodemailer';
import { EmailAttachment, IEmailService } from '../../../domain/services/email.service';
import { emailConfig } from '../../config/email.config';

export class EmailService implements IEmailService {
  private transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: emailConfig.user
      ? {
        user: emailConfig.user,
        pass: emailConfig.pass
      }
      : undefined
  });

  async send(to: string, subject: string, body: string, attachments?: EmailAttachment[]): Promise<void> {
    await this.transporter.sendMail({
      from: `${emailConfig.name} <${emailConfig.from}>`,
      to,
      subject,
      html: body,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
  }
}
