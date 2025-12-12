import type { ExchangeRate } from '@/remotes/exchange';
import type { CurrencyType } from '@/ui-lib';

/**
 * 현재 통화와 환율에 맞는 가격 string(단위 포함)을 반환
 * @param priceInUSD USD 기준의 가격
 * @param currency 현재 화폐 통화
 * @param exchangeRate 환율
 * @returns currency에 맞는 가격 문자열 (예. 1,000원, $19.33)
 */
export function formatPrice(priceInUSD: number, currency: CurrencyType, exchangeRate?: ExchangeRate): string {
  // 환율 정보가 없으면 USD로 표시
  if (!exchangeRate) {
    return `$${priceInUSD.toLocaleString('en-US')}`;
  }

  const rate = exchangeRate[currency];
  const converted = priceInUSD * rate;

  if (currency === 'KRW') {
    return `${Math.round(converted).toLocaleString('ko-KR')}원`;
  }

  // USD: 소수점이 있으면 유지, 정수면 생략
  const formatted = Number.isInteger(converted)
    ? converted.toLocaleString('en-US')
    : converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return `$${formatted}`;
}
