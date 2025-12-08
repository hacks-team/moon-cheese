import type { Product, ProductCategory } from '@/types/product';

type TabValue = 'cheese' | 'cracker' | 'tea';

export type CategoryFilter = 'all' | TabValue;

const CATEGORY_MAP: Record<TabValue, ProductCategory> = {
  cheese: 'CHEESE',
  cracker: 'CRACKER',
  tea: 'TEA',
};

export function filterProductsByCategory(products: Product[], category: CategoryFilter): Product[] {
  if (category === 'all') {
    return products;
  }

  return products.filter(product => product.category === CATEGORY_MAP[category]);
}
