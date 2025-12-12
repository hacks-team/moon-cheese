import { Spacing, Text } from '@/ui-lib';
import { useNavigate, useParams } from 'react-router';
import { HStack, Stack, styled } from 'styled-system/jsx';
import RecommendationProductItem from './RecommendationProductItem';
import { useSuspenseQueries } from '@tanstack/react-query';
import { productQueryOptions } from '@/remotes/queries/product';
import AsyncBoundary from '@/components/AsyncBoundary';
import ErrorSection from '@/components/ErrorSection';
import { exchangeQueryOptions } from '@/remotes/queries/exchange';
import { useCurrency } from '@/providers/CurrencyProvider';
import { formatPrice } from '@/utils/price';

function RecommendationSection() {
  return (
    <AsyncBoundary
      errorFallback={({ onRetry }) => <ErrorSection onRetry={onRetry} />}
      suspenseFallback={<RecommendationSkeleton />}
    >
      <RecommendationSectionContainer />
    </AsyncBoundary>
  );
}

const RecommendationSectionContainer = () => {
  const { id } = useParams();
  const productId = Number(id);

  if (!id || Number.isNaN(productId)) {
    throw new Error('Product ID is required');
  }

  const navigate = useNavigate();
  const { currency } = useCurrency();

  // 추천 상품 ID 목록 조회
  const [{ data: recommendProductIds }, { data: exchangeRate }] = useSuspenseQueries({
    queries: [productQueryOptions.recommendProductIds(productId), exchangeQueryOptions.exchangeRate()],
  });

  // 추천 상품 상세 정보 조회
  const productQueries = useSuspenseQueries({
    queries: recommendProductIds.map(id => productQueryOptions.productDetail(id)),
  });

  const recommendProductList = productQueries.map(query => query.data);

  const handleClickProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <styled.section css={{ bg: 'background.01_white', px: 5, pt: 5, pb: 6 }}>
      <Text variant="H2_Bold">추천 제품</Text>

      <Spacing size={4} />

      <HStack gap={1.5} overflowX="auto">
        {recommendProductList.map(product => (
          <RecommendationProductItem.Root key={product.id} onClick={() => handleClickProduct(product.id)}>
            {product.images.length > 0 && (
              <RecommendationProductItem.Image src={product.images[0]} alt={product.name} />
            )}
            <RecommendationProductItem.Info name={product.name} rating={product.rating} />
            <RecommendationProductItem.Price>
              {formatPrice(product.price, currency, exchangeRate)}
            </RecommendationProductItem.Price>
          </RecommendationProductItem.Root>
        ))}
      </HStack>
    </styled.section>
  );
};

const RecommendationSkeleton = () => (
  <styled.section css={{ bg: 'background.01_white', px: 5, pt: 5, pb: 6 }}>
    <styled.div
      css={{ w: '80px', h: '24px', rounded: 'md', bg: 'background.02_light-gray', animation: 'skeleton-pulse' }}
    />
    <Spacing size={4} />
    <HStack gap={1.5}>
      {[1, 2, 3].map(i => (
        <Stack key={i} gap={2} css={{ flexShrink: 0 }}>
          <styled.div
            css={{ w: '120px', h: '120px', rounded: 'xl', bg: 'background.02_light-gray', animation: 'skeleton-pulse' }}
          />
          <styled.div
            css={{ w: '80px', h: '16px', rounded: 'md', bg: 'background.02_light-gray', animation: 'skeleton-pulse' }}
          />
          <styled.div
            css={{ w: '60px', h: '14px', rounded: 'md', bg: 'background.02_light-gray', animation: 'skeleton-pulse' }}
          />
        </Stack>
      ))}
    </HStack>
  </styled.section>
);

export default RecommendationSection;
