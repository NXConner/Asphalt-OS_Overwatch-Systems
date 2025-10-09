import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { createPaymentIntent } from '@/lib/stripe';

const schema = z.object({ amountCents: z.number().int().positive(), currency: z.string().default('usd') });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const intent = await createPaymentIntent(parsed.data.amountCents, parsed.data.currency);
    return res.status(200).json({ clientSecret: intent.client_secret });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Failed to create payment intent' });
  }
}
