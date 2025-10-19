
import { z } from 'zod';

export const createMaterialSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  category: z.string().min(1, 'Category is required').max(100),
  unit: z.string().min(1, 'Unit is required').max(50),
  cost: z.number().min(0, 'Cost must be positive').max(1000000),
  supplier: z.string().max(200).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  quantityInStock: z.number().min(0).optional().default(0),
  reorderLevel: z.number().min(0).optional().default(0),
});

export const updateMaterialSchema = createMaterialSchema.partial();
