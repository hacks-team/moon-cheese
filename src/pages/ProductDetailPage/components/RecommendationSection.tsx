import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { Suspense, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { HStack, styled } from 'styled-system/jsx';
import ErrorSection from '@/components/ErrorSection';
import { formatPriceByCurrency } from '@/format/price';
import { useCurrency } from '@/provider/currency-provider';
import { getProductListQueryOptions, getRecommendProductIdsQueryOptions } from '@/remotes/queries/product';
import { Spacing, Text } from '@/ui-lib';
import RecommendationProductItem from './RecommendationProductItem';

type RecommendationSectionProps = {
  productId: number;
};

function RecommendationSectionContainer({ productId }: RecommendationSectionProps) {
  const navigate = useNavigate();
  const { currency, exchangeRate } = useCurrency();

  const [
    {
      data: { recommendProductIds },
    },
    {
      data: { products },
    },
  ] = useSuspenseQueries({
    queries: [getRecommendProductIdsQueryOptions(productId), getProductListQueryOptions],
  });

  const recommendProducts = useMemo(() => {
    return products.filter(product => recommendProductIds.includes(product.id));
  }, [products, recommendProductIds]);

  const handleClickProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <styled.section css={{ bg: 'background.01_white', px: 5, pt: 5, pb: 6 }}>
      <Text variant="H2_Bold">추천 제품</Text>

      <Spacing size={4} />

      <HStack gap={1.5} overflowX="auto">
        {recommendProducts.map(product => (
          <RecommendationProductItem.Root key={product.id} onClick={() => handleClickProduct(product.id)}>
            <RecommendationProductItem.Image src={product.images[0]} alt={product.name} />
            <RecommendationProductItem.Info name={product.name} rating={product.rating} />
            <RecommendationProductItem.Price>
              {formatPriceByCurrency(product.price * exchangeRate, currency)}
            </RecommendationProductItem.Price>
          </RecommendationProductItem.Root>
        ))}
      </HStack>
    </styled.section>
  );
}

function RecommendationSection({ productId }: RecommendationSectionProps) {
  return (
    <ErrorBoundary fallback={<ErrorSection />}>
      <Suspense>
        <RecommendationSectionContainer productId={productId} />
      </Suspense>
    </ErrorBoundary>
  );
}

export default RecommendationSection;
