import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';

const schema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  text: z.string().optional(),
  html: z.string().optional(),
  from: z.string().email().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const result = await sendEmail(parsed.data);
    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Failed to send email' });
  }
}
