
import { z } from 'zod';

export const createMeasurementSchema = z.object({
  jobId: z.string().uuid('Invalid job ID').optional().nullable(),
  type: z.enum(['distance', 'area', 'perimeter']),
  value: z.number().min(0, 'Value must be positive'),
  unit: z.enum(['feet', 'meters', 'yards', 'sq_feet', 'sq_meters', 'acres']),
  coordinates: z.array(z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  })).min(2, 'At least 2 coordinates required'),
  notes: z.string().max(1000).optional().nullable(),
});

export const updateMeasurementSchema = createMeasurementSchema.partial().omit({ jobId: true });
