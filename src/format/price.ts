const formatPriceByCurrency = (price: number, currency: 'KRW' | 'USD') => {
  if (currency === 'KRW') {
    const formattedPrice = Math.round(price).toLocaleString('ko-KR');
    return `${formattedPrice}원`;
  }

  return `$${price}`;
};

export { formatPriceByCurrency };
