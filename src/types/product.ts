/**
 * Product 타입 정의 - Tagged Union (Discriminated Union)
 *
 * 불가능한 상태를 유발하는 인터페이스의 유니온 대신 유니온의 인터페이스 패턴을 사용합니다.
 * https://github.com/The-Dev-Study/Effective-Typescript/blob/main/chapter4/%EB%8F%99%ED%98%84.md
 */

// 공통 Product 기본 속성
interface ProductBase {
  id: number;
  name: string;
  stock: number;
  price: number;
  description: string;
  detailDescription: string;
  images: string[];
  rating: number;
}

// 치즈 상품 - 추가 속성 없음
export interface CheeseProduct extends ProductBase {
  category: 'CHEESE';
}

// 크래커 상품 - 글루텐 프리 여부 포함
export interface CrackerProduct extends ProductBase {
  category: 'CRACKER';
  isGlutenFree?: boolean;
}

// 티 상품 - 카페인 프리 여부 포함
export interface TeaProduct extends ProductBase {
  category: 'TEA';
  isCaffeineFree?: boolean;
}

// Tagged Union - 유니온의 인터페이스
export type Product = CheeseProduct | CrackerProduct | TeaProduct;

// 유니온 직접 지정 대신 자동 추론되도록 두는게 관리포인트 단일화 측면에서 좋아보임
export type ProductCategory = Product['category'];
