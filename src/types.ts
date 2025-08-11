export type Grade = 'EXPLORER' | 'PILOT' | 'COMMANDER';

export type GradePoint = {
  type: Grade;
  minPoint: number;
};

export type ProductCategory = 'CHEESE' | 'CRACKER' | 'TEA';

export type Product = {
  id: number;
  name: string;
  category: ProductCategory;
  stock: number;
  price: number;
  description: string;
  detailDescription: string;
  images: string[];
  rating: number;
  isGlutenFree?: boolean;
  isCaffeineFree?: boolean;
};

export type CartItem = {
  productId: number;
  quantity: number;
};
