
import { z } from 'zod';

export const createRevenueSchema = z.object({
  source: z.string().min(1, 'Source is required').max(200),
  amount: z.number().min(0, 'Amount must be positive').max(10000000),
  category: z.string().min(1, 'Category is required').max(100),
  date: z.string().datetime('Invalid date'),
  description: z.string().max(1000).optional().nullable(),
  invoiceId: z.string().uuid().optional().nullable(),
  jobId: z.string().uuid().optional().nullable(),
  paymentMethod: z.enum(['cash', 'check', 'credit_card', 'ach', 'wire', 'other']).optional(),
});

export const updateRevenueSchema = createRevenueSchema.partial();
