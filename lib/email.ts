import { isEnabled } from '@/lib/flags';
import { log } from '@/lib/log';

let sendgrid: any = null;

export type EmailPayload = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
};

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean; id?: string; skipped?: boolean }>{
  if (!isEnabled('email_notifications')) {
    log.info('email feature disabled, skipping send', { to: payload.to });
    return { ok: true, skipped: true };
  }

  const apiKey = process.env.SENDGRID_API_KEY;
  const defaultFrom = process.env.EMAIL_FROM || 'no-reply@example.com';
  if (!apiKey) {
    log.warn('SENDGRID_API_KEY missing, skipping email');
    return { ok: true, skipped: true };
  }

  if (!sendgrid) {
    sendgrid = await import('@sendgrid/mail');
    sendgrid.setApiKey(apiKey);
  }

  const msg = {
    to: payload.to,
    from: payload.from || defaultFrom,
    subject: payload.subject,
    text: payload.text,
    html: payload.html || `<p>${payload.text || ''}</p>`,
  };

  const [res] = await sendgrid.send(msg);
  return { ok: res.statusCode >= 200 && res.statusCode < 300, id: res.headers['x-message-id'] };
}
