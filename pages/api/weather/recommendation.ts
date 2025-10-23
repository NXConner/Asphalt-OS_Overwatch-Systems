/**
 * @openapi
 * /api/weather/recommendation:
 *   post:
 *     summary: Get scheduling recommendation window based on forecast
 *     tags:
 *       - Weather
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               forecast:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     time: { type: string, format: date-time }
 *                     precipitationIn: { type: number }
 *                     tempF: { type: number }
 *                     windMph: { type: number }
 *     responses:
 *       200:
 *         description: Recommended scheduling window
 *       400:
 *         description: Validation error
 *       405:
 *         description: Method not allowed
 */
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
