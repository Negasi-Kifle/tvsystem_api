import nodemailer from 'nodemailer';
import { EmailServiceInterface } from '../../../domain/interfaces/services/email.service.interface';
import { emailConfig } from '../../config/email.config';

export class EmailService implements EmailServiceInterface {
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
