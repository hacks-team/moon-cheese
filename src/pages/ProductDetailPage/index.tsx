import { Spacing } from '@/ui-lib';
import ProductDetailSection from './components/ProductDetailSection';
import ProductInfoSection from './components/ProductInfoSection';
import RecommendationSection from './components/RecommendationSection';
import ThumbnailSection from './components/ThumbnailSection';
import { useParams } from 'react-router';
import { useSuspenseQueries } from '@tanstack/react-query';
import { productQueryOptions } from '@/remotes/queries/product';
import AsyncBoundary from '@/components/AsyncBoundary';
import ErrorSection from '@/components/ErrorSection';
import { categoryToTagType } from '@/constants/category';
import { exchangeQueryOptions } from '@/remotes/queries/exchange';
import { useCurrency } from '@/providers/CurrencyProvider';
import { formatPrice } from '@/utils/price';
import { Box, Stack, styled } from 'styled-system/jsx';

function ProductDetailPage() {
  return (
    <AsyncBoundary
      errorFallback={({ onRetry }) => <ErrorSection onRetry={onRetry} />}
      suspenseFallback={<ProductDetailPageSkeleton />}
    >
      <ProductDetailPageContainer />
    </AsyncBoundary>
  );
}

const ProductDetailPageContainer = () => {
  const { id } = useParams();
  const productId = Number(id);

  if (!id || Number.isNaN(productId)) {
    throw new Error('Product ID is required');
  }

  const { currency } = useCurrency();

  const [{ data: product }, { data: exchangeRate }] = useSuspenseQueries({
    queries: [productQueryOptions.productDetail(productId), exchangeQueryOptions.exchangeRate()],
  });

  return (
    <>
      <ThumbnailSection images={product.images} />
      <ProductInfoSection
        key={product.id}
        product={product}
        category={categoryToTagType(product.category)}
        formattedPrice={formatPrice(product.price, currency, exchangeRate)}
      />

      <Spacing size={2.5} />

      <ProductDetailSection description={product.detailDescription} />

      <Spacing size={2.5} />

      <RecommendationSection />
    </>
  );
};

const ProductDetailPageSkeleton = () => (
  <>
    {/* 썸네일 */}
    <styled.div css={{ w: 'full', aspectRatio: 1, bg: 'background.02_light-gray', animation: 'skeleton-pulse' }} />

    {/* 상품 정보 */}
    <Box css={{ bg: 'background.01_white', p: 5 }}>
      <Stack gap={3}>
        <styled.div
          css={{ w: '60px', h: '24px', rounded: 'full', bg: 'background.02_light-gray', animation: 'skeleton-pulse' }}
        />
        <styled.div
          css={{ w: '70%', h: '20px', rounded: 'md', bg: 'background.02_light-gray', animation: 'skeleton-pulse' }}
        />
        <styled.div
          css={{ w: '40%', h: '28px', rounded: 'md', bg: 'background.02_light-gray', animation: 'skeleton-pulse' }}
        />
      </Stack>
    </Box>
  </>
);

export default ProductDetailPage;
