
import { z } from 'zod';

export const createPhotoSchema = z.object({
  jobId: z.string().uuid('Invalid job ID'),
  url: z.string().url('Invalid URL').max(1000),
  caption: z.string().max(500).optional().nullable(),
  category: z.enum(['before', 'during', 'after', 'material', 'equipment', 'team', 'other']).default('other'),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional().nullable(),
});

export const updatePhotoSchema = createPhotoSchema.partial().omit({ jobId: true });
