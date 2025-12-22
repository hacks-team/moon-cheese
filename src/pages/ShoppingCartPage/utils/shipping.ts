import type { GradeType } from '@/coreBusiness/grade';
import type { GradeShipping } from '@/queries/grade';
import type { Product } from '@/types/product';
import type { DeliveryType } from '../index';

export const PREMIUM_SURCHARGE = 5;

type CartItem = { productId: number; quantity: number };

/** 등급에 해당하는 배송 정보 찾기 */
export function findGradeShipping(grade: GradeType, gradeShippingList: GradeShipping[]) {
  return gradeShippingList.find(s => s.type === grade);
}

/** 등급별 배송비 계산 (Express/Premium 가격) */
export function calculateDeliveryPrices(gradeShipping: GradeShipping | undefined) {
  const expressPrice = gradeShipping?.shippingFee ?? 0;

  return {
    expressPrice,
    premiumPrice: expressPrice + PREMIUM_SURCHARGE,
  };
}

/** 상품 총액 계산 */
export function calculateProductsTotal(cartItems: CartItem[], products: Product[]) {
  return cartItems.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) {
      return total;
    }
    return total + product.price * item.quantity;
  }, 0);
}

interface DeliveryFeeParams {
  deliveryType: DeliveryType;
  baseShippingFee: number;
  freeShippingThreshold: number;
  productsTotalPrice: number;
}

/** 배송비 계산 (무료배송 조건 포함) */
export function calculateDeliveryFee(params: DeliveryFeeParams) {
  const { deliveryType, baseShippingFee, freeShippingThreshold, productsTotalPrice } = params;
  const actualShippingFee = deliveryType === 'PREMIUM' ? baseShippingFee + PREMIUM_SURCHARGE : baseShippingFee;

  if (productsTotalPrice >= freeShippingThreshold) {
    return 0;
  }

  return actualShippingFee;
}
