/**
 * @openapi
 * /api/email:
 *   post:
 *     summary: Send an email via configured provider
 *     tags:
 *       - Email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to: { type: string, format: email }
 *               subject: { type: string }
 *               text: { type: string }
 *               html: { type: string }
 *               from: { type: string, format: email }
 *     responses:
 *       200:
 *         description: Email send result
 *       400:
 *         description: Validation error
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Provider error
 */
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
