
import { z } from 'zod';

export const createTimesheetSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  jobId: z.string().uuid('Invalid job ID').optional().nullable(),
  clockIn: z.string().datetime('Invalid clock in time'),
  clockOut: z.string().datetime('Invalid clock out time').optional().nullable(),
  breakMinutes: z.number().min(0).max(480).optional().default(0),
  notes: z.string().max(1000).optional().nullable(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional().nullable(),
});

export const updateTimesheetSchema = createTimesheetSchema.partial().omit({ userId: true });
