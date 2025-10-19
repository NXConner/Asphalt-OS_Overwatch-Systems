
import { z } from 'zod';

export const invoiceSchema = z.object({
  jobId: z.string().optional(),
  clientId: z.string().optional(),
  invoiceNumber: z.string().min(1, 'Invoice number is required').max(100),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  subtotal: z.number().positive('Subtotal must be positive'),
  tax: z.number().min(0, 'Tax cannot be negative').optional(),
  total: z.number().positive('Total must be positive'),
  dueDate: z.string().datetime().or(z.date()),
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']).optional(),
  paymentDate: z.string().datetime().optional().or(z.date()).optional(),
  notes: z.string().max(2000).optional(),
});

export const invoiceLineItemSchema = z.object({
  invoiceId: z.string(),
  description: z.string().min(1, 'Description is required').max(500),
  quantity: z.number().positive('Quantity must be positive'),
  unitPrice: z.number().positive('Unit price must be positive'),
  total: z.number().positive('Total must be positive'),
});

export const invoiceUpdateSchema = invoiceSchema.partial();

export const invoiceQuerySchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']).optional(),
  clientId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type InvoiceLineItemInput = z.infer<typeof invoiceLineItemSchema>;
export type InvoiceUpdate = z.infer<typeof invoiceUpdateSchema>;
export type InvoiceQuery = z.infer<typeof invoiceQuerySchema>;

// Aliases for security middleware
export const createInvoiceSchema = invoiceSchema;
export const updateInvoiceSchema = invoiceUpdateSchema;

