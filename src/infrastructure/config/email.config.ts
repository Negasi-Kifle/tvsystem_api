export const emailConfig = {
  host: process.env.SMTP_HOST || '',
  port: Number(process.env.SMTP_PORT || 587),
  user: process.env.SMTP_EMAIL || '',
  pass: process.env.SMTP_PASSWORD || '',
  from: process.env.FROM_EMAIL || 'no-reply@example.com',
  name: process.env.FROM_NAME || 'Abbay TV',
  financeEmail: process.env.FINANCE_EMAIL || process.env.FINANCE_TEAM_EMAIL || '',
};
