
import { z } from 'zod';

export const expenseSchema = z.object({
  description: z.string().min(1, 'Description is required').max(500),
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  expenseDate: z.string().datetime().or(z.date()),
  vendor: z.string().max(200).optional(),
  paymentMethod: z.string().optional(),
  receiptUrl: z.string().url('Invalid URL').optional(),
  jobId: z.string().optional(),
  userId: z.string().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  notes: z.string().max(1000).optional(),
});

export const expenseUpdateSchema = expenseSchema.partial();

export const expenseQuerySchema = z.object({
  category: z.string().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  userId: z.string().optional(),
  jobId: z.string().optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
export type ExpenseUpdate = z.infer<typeof expenseUpdateSchema>;
export type ExpenseQuery = z.infer<typeof expenseQuerySchema>;

