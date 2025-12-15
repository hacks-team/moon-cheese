export type RecentProduct = {
  id: number;
  thumbnail: string;
  name: string;
  price: number;
};

export type ProductCategory = 'CHEESE' | 'CRACKER' | 'TEA';

interface ProductBase {
  id: number;
  name: string;
  category: ProductCategory;
  stock: number;
  price: number;
  description: string;
  detailDescription: string;
  images: string[];
  rating: number;
}

export type Product =
  | (ProductBase & { category: 'CHEESE' })
  | (ProductBase & { category: 'CRACKER'; isGlutenFree?: boolean })
  | (ProductBase & { category: 'TEA'; isCaffeineFree?: boolean });
