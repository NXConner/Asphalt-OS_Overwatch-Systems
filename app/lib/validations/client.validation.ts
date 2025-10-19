
import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email format').optional().nullable(),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(20).optional().nullable(),
  address: z.string().min(5, 'Address is required').max(500).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(50).optional().nullable(),
  zipCode: z.string().max(20).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export const updateClientSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().min(10).max(20).optional().nullable(),
  address: z.string().min(5).max(500).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(50).optional().nullable(),
  zipCode: z.string().max(20).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});
