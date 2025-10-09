import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { calculateSealerGallons, calculateCrackFillerPounds, calculateStripingGallons } from '@/lib/materials';

const schema = z.object({
  sealcoat: z.object({ areaSqFt: z.number(), coats: z.number(), coverageSqFtPerGallon: z.number() }).optional(),
  crack: z.object({ linearFeet: z.number(), poundsPerLinearFoot: z.number() }).optional(),
  striping: z.object({ linearFeet: z.number(), coverageLfPerGallon: z.number() }).optional(),
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const results: any = {};
  const body = parsed.data;
  if (body.sealcoat) results.sealcoatGallons = calculateSealerGallons(body.sealcoat);
  if (body.crack) results.crackFillerPounds = calculateCrackFillerPounds(body.crack);
  if (body.striping) results.stripingGallons = calculateStripingGallons(body.striping);

  return res.status(200).json(results);
}
