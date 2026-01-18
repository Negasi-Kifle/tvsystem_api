export const emailConfig = {
  host: process.env.SMTP_HOST || '',
  port: Number(process.env.SMTP_PORT || 587),
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  from: process.env.EMAIL_FROM || 'no-reply@example.com'
};
