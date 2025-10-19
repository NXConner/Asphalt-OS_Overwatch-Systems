
import { z } from 'zod';

export const estimateSchema = z.object({
  jobId: z.string().optional(),
  clientId: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  serviceType: z.string().optional(),
  subtotal: z.number().positive('Subtotal must be positive').optional(),
  tax: z.number().min(0, 'Tax cannot be negative').optional(),
  total: z.number().positive('Total must be positive').optional(),
  validUntil: z.string().datetime().optional().or(z.date()).optional(),
  status: z.enum(['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED']).optional(),
  notes: z.string().max(2000).optional(),
});

export const estimateLineItemSchema = z.object({
  estimateId: z.string(),
  description: z.string().min(1, 'Description is required').max(500),
  quantity: z.number().positive('Quantity must be positive'),
  unitPrice: z.number().positive('Unit price must be positive'),
  total: z.number().positive('Total must be positive'),
});

export const estimateUpdateSchema = estimateSchema.partial();

export type EstimateInput = z.infer<typeof estimateSchema>;
export type EstimateLineItemInput = z.infer<typeof estimateLineItemSchema>;
export type EstimateUpdate = z.infer<typeof estimateUpdateSchema>;

