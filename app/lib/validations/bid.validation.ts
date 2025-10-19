
import { z } from 'zod';

export const createBidSchema = z.object({
  clientName: z.string().min(1, 'Client name is required').max(200),
  clientEmail: z.string().email('Invalid email').optional().nullable(),
  clientPhone: z.string().min(10).max(20).optional().nullable(),
  projectAddress: z.string().min(5, 'Project address is required').max(500),
  projectDescription: z.string().min(10, 'Description is required').max(5000),
  estimatedCost: z.number().min(0, 'Cost must be positive').max(10000000),
  estimatedDuration: z.string().max(100).optional().nullable(),
  status: z.enum(['pending', 'sent', 'accepted', 'rejected', 'expired']).default('pending'),
  notes: z.string().max(2000).optional().nullable(),
  validUntil: z.string().datetime().optional().nullable(),
});

export const updateBidSchema = createBidSchema.partial();
