export type Grade = 'EXPLORER' | 'PILOT' | 'COMMANDER';
export type Currency = 'USD' | 'KRW';
export interface GradePoint {
  type: Grade;
  minPoint: number;
}

export interface Product {
  id: number;
  thumbnail: string;
  name: string;
  price: number;
}
