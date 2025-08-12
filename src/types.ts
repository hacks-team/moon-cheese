export type Grade = 'EXPLORER' | 'PILOT' | 'COMMANDER';

export type GradePoint = {
  type: Grade;
  minPoint: number;
};

export type ProductCategory = 'CHEESE' | 'CRACKER' | 'TEA';

export type BaseProduct = {
  id: number;
  name: string;
  stock: number;
  price: number;
  description: string;
  detailDescription: string;
  images: string[];
  rating: number;
};

interface Cracker extends BaseProduct {
  category: 'CRACKER';
  isGlutenFree: boolean;
}

interface Tea extends BaseProduct {
  category: 'TEA';
  isCaffeineFree: boolean;
}

interface Cheese extends BaseProduct {
  category: 'CHEESE';
}

export type Product = Cracker | Tea | Cheese;

export type CartItem = {
  productId: number;
  quantity: number;
};
