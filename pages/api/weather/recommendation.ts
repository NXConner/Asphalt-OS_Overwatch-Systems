import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { getSchedulingRecommendation } from '@/lib/weather';

const schema = z.object({
  forecast: z.array(z.object({
    time: z.string(),
    precipitationIn: z.number().nonnegative(),
    tempF: z.number(),
    windMph: z.number().nonnegative(),
  }))
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const normalized = parsed.data.forecast.map(f => ({ ...f, time: new Date(f.time) }));
  const window = getSchedulingRecommendation(normalized);
  return res.status(200).json({ window });
}
