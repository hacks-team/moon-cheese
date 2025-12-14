export type Grade = 'EXPLORER' | 'PILOT' | 'COMMANDER';
export type Currency = 'USD' | 'KRW';
export interface GradePoint {
  type: Grade;
  minPoint: number;
}

export interface RecentProduct {
  id: number;
  thumbnail: string;
  name: string;
  price: number;
}

export interface CheeseProduct {
  id: number;
  name: string;
  category: 'CHEESE';
  stock: number;
  price: number;
  description: string;
  detailDescription: string;
  images: string[];
  rating: number;
  // isGlutenFree?: boolean;
  // isCaffeineFree?: boolean;
}

export interface CrackerProduct {
  id: number;
  name: string;
  category: 'CRACKER';
  stock: number;
  price: number;
  description: string;
  detailDescription: string;
  images: string[];
  rating: number;
  isGlutenFree?: boolean;
}

export interface TeaProduct {
  id: number;
  name: string;
  category: 'TEA';
  stock: number;
  price: number;
  description: string;
  detailDescription: string;
  images: string[];
  rating: number;
  isCaffeineFree?: boolean;
}

export type Product = CheeseProduct | CrackerProduct | TeaProduct;

export type CartItem = Product;

export type ExchangeRate = {
  KRW: number;
  USD: number;
};
