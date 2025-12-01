import type { Currency } from '@/type';

export const formatPriceByCurrency = (price: number, currency: Currency) => {
  switch (currency) {
    case 'KRW':
      return `${Math.round(price).toLocaleString('ko-KR')}원`;
    case 'USD':
      return `$${price.toLocaleString('en-US')}`;
    default:
      currency satisfies never;
      return;
  }
};
