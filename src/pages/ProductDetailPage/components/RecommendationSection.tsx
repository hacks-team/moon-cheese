import ErrorSection from '@/components/ErrorSection';
import { useCurrencyContext } from '@/providers/CurrencyProvider';
import { queries } from '@/queries';
import type { ExchangeRate } from '@/types/currency';
import type { Product } from '@/types/product';
import { Spacing, Text, type CurrencyType } from '@/ui-lib';
import { formatPrice } from '@/utils/currency';
import { useQueryClient, useSuspenseQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import { useNavigate } from 'react-router';
import { Box, HStack, styled } from 'styled-system/jsx';
import RecommendationProductItem from './RecommendationProductItem';

function useRecommendedProducts(productId: number) {
  const [{ data: recommendData }, { data: productListData }, { data: exchangeRateData }] = useSuspenseQueries({
    queries: [queries.product.recommend(productId), queries.product.list, queries.exchangeRate.current],
  });
  // quries라 select 대신 useMemo 사용
  const products = useMemo(() => {
    const { recommendProductIds } = recommendData;
    return productListData.products.filter(product => recommendProductIds.includes(product.id));
  }, [recommendData, productListData]);

  return { products, exchangeRate: exchangeRateData.exchangeRate };
}

type RecommendationSectionProps = {
  productId: number;
};

function RecommendationSection({ productId }: RecommendationSectionProps) {
  const [currency] = useCurrencyContext();
  const { products, exchangeRate } = useRecommendedProducts(productId);

  return (
    <styled.section css={{ bg: 'background.01_white', px: 5, pt: 5, pb: 6 }}>
      <Text variant="H2_Bold">추천 제품</Text>

      <Spacing size={4} />

      <HStack gap={1.5} overflowX="auto">
        {products.map(product => (
          <RecommendedProductCard key={product.id} product={product} exchangeRate={exchangeRate} currency={currency} />
        ))}
      </HStack>
    </styled.section>
  );
}

type RecommendedProductCardProps = {
  product: Product;
  exchangeRate: ExchangeRate;
  currency: CurrencyType;
};

function RecommendedProductCard({ product, exchangeRate, currency }: RecommendedProductCardProps) {
  const navigate = useNavigate();
  const formattedPrice = formatPrice(product.price, currency, exchangeRate);

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <RecommendationProductItem.Root onClick={handleClick}>
      <RecommendationProductItem.Image src={product.images[0]} alt={product.name} />
      <RecommendationProductItem.Info name={product.name} rating={product.rating} />
      <RecommendationProductItem.Price>{formattedPrice}</RecommendationProductItem.Price>
    </RecommendationProductItem.Root>
  );
}

function RecommendationSectionSkeleton() {
  return (
    <styled.section css={{ bg: 'background.01_white', px: 5, pt: 5, pb: 6 }}>
      <Text variant="H2_Bold">추천 제품</Text>

      <Spacing size={4} />

      <HStack gap={1.5} overflowX="auto">
        {[1, 2, 3].map(i => (
          <Box key={i} css={{ flexShrink: 0, w: '140px' }}>
            <Box css={{ w: 'full', aspectRatio: 1, bg: 'neutral.04_gray', rounded: '2xl', animation: 'pulse' }} />
            <Box css={{ w: '80%', h: 4, bg: 'neutral.04_gray', rounded: 'md', mt: 4, animation: 'pulse' }} />
            <Box css={{ w: 16, h: 3, bg: 'neutral.04_gray', rounded: 'md', mt: 1, animation: 'pulse' }} />
            <Box css={{ w: 20, h: 4, bg: 'neutral.04_gray', rounded: 'md', mt: 2, animation: 'pulse' }} />
          </Box>
        ))}
      </HStack>
    </styled.section>
  );
}

function RecommendationSectionError({ resetErrorBoundary }: FallbackProps) {
  const queryClient = useQueryClient();

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['product'] });
    resetErrorBoundary();
  };

  return (
    <styled.section css={{ bg: 'background.01_white', px: 5, pt: 5, pb: 6 }}>
      <Text variant="H2_Bold">추천 제품</Text>
      <Spacing size={4} />
      <ErrorSection onRetry={handleRetry} />
    </styled.section>
  );
}

RecommendationSection.Skeleton = RecommendationSectionSkeleton;
RecommendationSection.Error = RecommendationSectionError;

export default RecommendationSection;
