
import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500, 'Address too long'),
  clientId: z.string().optional(),
  serviceType: z.string().optional(),
  status: z.enum(['PENDING', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  scheduledDate: z.string().datetime().optional().or(z.date()).optional(),
  completedDate: z.string().datetime().optional().or(z.date()).optional(),
  estimatedCost: z.number().positive('Cost must be positive').optional(),
  actualCost: z.number().positive('Cost must be positive').optional(),
  estimatedDuration: z.number().positive('Duration must be positive').optional(),
  actualDuration: z.number().positive('Duration must be positive').optional(),
  squareFootage: z.number().positive('Square footage must be positive').optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  notes: z.string().max(2000, 'Notes too long').optional(),
});

export const jobUpdateSchema = jobSchema.partial();

export const jobQuerySchema = z.object({
  status: z.enum(['PENDING', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  clientId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type JobInput = z.infer<typeof jobSchema>;
export type JobUpdate = z.infer<typeof jobUpdateSchema>;
export type JobQuery = z.infer<typeof jobQuerySchema>;

