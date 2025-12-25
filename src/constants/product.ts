import type { ProductCategory } from '@/types/product';
import type { TagType } from '@/ui-lib';

export const CATEGORY_TO_TAG_TYPE: Record<ProductCategory, TagType> = {
  CHEESE: 'cheese',
  CRACKER: 'cracker',
  TEA: 'tea',
};
