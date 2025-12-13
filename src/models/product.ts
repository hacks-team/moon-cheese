import { z } from 'zod';

export const ProductCategorySchema = z.enum(['ALL', 'CHEESE', 'CRACKER', 'TEA']).default('ALL').catch('ALL');
export type ProductCategory = z.infer<typeof ProductCategorySchema>;
