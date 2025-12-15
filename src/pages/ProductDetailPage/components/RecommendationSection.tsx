import { Spacing, Text } from '@/ui-lib';
import { useNavigate, useParams } from 'react-router';
import { HStack, styled, Box } from 'styled-system/jsx';
import RecommendationProductItem from './RecommendationProductItem';
import { useRecommendedProductList, useRecommendedProductDetails } from '@/lib/api/products';
import { AsyncBoundary } from '@/ui-lib/components/AsyncBoundary';
import ErrorSection from '@/components/ErrorSection';
import type { Product } from '@/lib/types/products';
import { formatCurrencyPrice } from '@/utils/format';
import { useCurrencyContext } from '@/providers/CurrencyProvider';
import { useExchangeRate } from '@/lib/api/common';
import { convertCurrencyPrice } from '@/utils/calculate';

// 아쉬운점
// queries 를 사용하고 있지만 suspense 를 로딩과 사용하고 있지 않음
// 로직이 전체적으로 너무 더러움

function RecommendationSection() {
  const { id } = useParams<{ id: string }>();
  const recommendedProductList = useRecommendedProductList(Number(id));
  const recommendedProductDetailArray = useRecommendedProductDetails(recommendedProductList.data);
  const recommendedProducts = recommendedProductDetailArray.map(detail => detail.data).filter(Boolean) as Product[];
  const exchangeRate = useExchangeRate();
  const { currency } = useCurrencyContext();

  const isLoading =
    recommendedProductList.isFetching || recommendedProductDetailArray.some(detail => detail.isFetching);
  const isError = recommendedProductList.isError || recommendedProductDetailArray.some(detail => detail.isError);
  const navigate = useNavigate();

  const handleClickProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <styled.section css={{ bg: 'background.01_white', px: 5, pt: 5, pb: 6 }}>
      <Text variant="H2_Bold">추천 제품</Text>

      <Spacing size={4} />

      <HStack gap={1.5} overflowX="auto">
        <AsyncBoundary
          isLoading={isLoading}
          isError={isError}
          loadingFallback={<RecommendationSectionSkeleton />}
          errorFallback={
            <ErrorSection
              onRetry={() => {
                recommendedProductList.refetch();
                recommendedProductDetailArray.forEach(detail => detail.refetch());
              }}
            />
          }
        >
          {recommendedProducts.map(product => {
            return (
              <styled.section key={product.id}>
                <RecommendationProductItem.Root onClick={() => handleClickProduct(product.id)}>
                  <RecommendationProductItem.Image src={product.images[0]} alt={product.name} />
                  <RecommendationProductItem.Info name={product.name} rating={product.rating} />
                  <RecommendationProductItem.Price>
                    {formatCurrencyPrice(convertCurrencyPrice(product.price, currency, exchangeRate.data), currency)}
                  </RecommendationProductItem.Price>
                </RecommendationProductItem.Root>
              </styled.section>
            );
          })}
        </AsyncBoundary>
      </HStack>
    </styled.section>
  );
}

export default RecommendationSection;

const RecommendationSectionSkeleton = () => {
  return (
    <HStack gap={1.5} overflowX="auto">
      <Box width="100px" height="100px" />
    </HStack>
  );
};
