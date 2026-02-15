import nodemailer from 'nodemailer';
import { IEmailService } from '../../../domain/services/email.service';
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

  async send(to: string, subject: string, body: string): Promise<void> {
    await this.transporter.sendMail({
      from: emailConfig.from,
      to,
      subject,
      html: body
    });
  }
}
