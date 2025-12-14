import { z } from 'zod';

export const ProductCategorySchema = z.enum(['ALL', 'CHEESE', 'CRACKER', 'TEA']).default('ALL').catch('ALL');
export type ProductCategory = z.infer<typeof ProductCategorySchema>;

export const ProductIdSchema = z.coerce.number({ error: '해당하는 상품이 없어요.' });
