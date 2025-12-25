import type { ExchangeRate } from '@/types/currency';
import type { CurrencyType } from '@/ui-lib';

/**
 * USD 가격을 선택한 통화로 변환합니다.
 * 원화의 경우 소수점을 반올림합니다.
 */
export function convertPrice(priceInUSD: number, currency: CurrencyType, exchangeRate: ExchangeRate): number {
  if (currency === 'USD') {
    return priceInUSD;
  }
  // KRW: 환율을 곱하고 반올림
  return Math.round(priceInUSD * exchangeRate.KRW);
}

/**
 * 가격을 통화 기호와 콤마가 포함된 문자열로 포맷팅합니다.
 */
export function formatPrice(priceInUSD: number, currency: CurrencyType, exchangeRate: ExchangeRate): string {
  const convertedPrice = convertPrice(priceInUSD, currency, exchangeRate);

  if (currency === 'USD') {
    const isInteger = Number.isInteger(convertedPrice);
    const formattedPrice = convertedPrice.toLocaleString('en-US', {
      minimumFractionDigits: isInteger ? 0 : 2,
      maximumFractionDigits: 2,
    });
    return `$${formattedPrice}`;
  }
  // KRW
  const formattedPrice = convertedPrice.toLocaleString('ko-KR');
  return `${formattedPrice}원`;
}
