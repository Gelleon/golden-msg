import nodemailer from 'nodemailer';

function parseEnvBoolean(value: string | undefined) {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  return v === 'true' || v === '1' || v === 'yes' || v === 'y' || v === 'on';
}

function parseEnvPort(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  if (n <= 0 || n > 65535) return fallback;
  return Math.trunc(n);
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseEnvPort(process.env.EMAIL_PORT, 587),
  secure: process.env.EMAIL_SECURE ? parseEnvBoolean(process.env.EMAIL_SECURE) : parseEnvPort(process.env.EMAIL_PORT, 587) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email using the configured transporter.
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    const missing = [
      !process.env.EMAIL_HOST ? 'EMAIL_HOST' : null,
      !process.env.EMAIL_USER ? 'EMAIL_USER' : null,
      !process.env.EMAIL_PASS ? 'EMAIL_PASS' : null,
    ].filter(Boolean);
    const msg = `Email is not configured. Missing env: ${missing.join(', ')}`;
    console.error(msg);
    return { success: false, error: msg };
  }
  try {
    const info = await transporter.sendMail({
      from: `"Golden Russia" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to send email:', error);
    return { success: false, error: msg };
  }
}

export default transporter;
