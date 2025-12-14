import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { Suspense } from 'react';
import { useNavigate } from 'react-router';
import { HStack, styled } from 'styled-system/jsx';
import ErrorSection from '@/components/ErrorSection';
import { formatPriceByCurrency } from '@/format/number';
import { useCurrency } from '@/providers/currency-provider';
import { getProductListQueryOptions, getRecommendProductIdsByProductIdQueryOptions } from '@/remotes/queries/product';
import { Spacing, Text } from '@/ui-lib';
import RecommendationProductItem from './RecommendationProductItem';

interface RecommendationSectionProps {
  productId: number;
}

function RecommendationSectionContainer({ productId }: RecommendationSectionProps) {
  const recommendedProducts = useSuspenseQueries({
    queries: [getRecommendProductIdsByProductIdQueryOptions(productId), getProductListQueryOptions()],
    combine(result) {
      const [
        {
          data: { recommendProductIds },
        },
        {
          data: { products },
        },
      ] = result;
      return products.filter(product => recommendProductIds.includes(product.id));
    },
  });
  const navigate = useNavigate();

  const { currency, exchangeRate } = useCurrency();

  const handleClickProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <styled.section css={{ bg: 'background.01_white', px: 5, pt: 5, pb: 6 }}>
      <Text variant="H2_Bold">추천 제품</Text>

      <Spacing size={4} />

      <HStack gap={1.5} overflowX="auto">
        {recommendedProducts.map(recommendedProduct => {
          return (
            <RecommendationProductItem.Root
              key={recommendedProduct.id}
              onClick={() => handleClickProduct(recommendedProduct.id)}
            >
              <RecommendationProductItem.Image src={recommendedProduct.images[0]} alt={recommendedProduct.name} />
              <RecommendationProductItem.Info name={recommendedProduct.name} rating={recommendedProduct.rating} />
              <RecommendationProductItem.Price>
                {formatPriceByCurrency(recommendedProduct.price * exchangeRate[currency], currency)}
              </RecommendationProductItem.Price>
            </RecommendationProductItem.Root>
          );
        })}
      </HStack>
    </styled.section>
  );
}

const RecommendationSection = ErrorBoundary.with(
  { fallback: ({ reset }) => <ErrorSection onRetry={reset} /> },
  ({ productId }: RecommendationSectionProps) => {
    return (
      <Suspense>
        <RecommendationSectionContainer productId={productId} />
      </Suspense>
    );
  }
);

export default RecommendationSection;
