import ErrorSection from '@/components/ErrorSection';
import { queries } from '@/queries';
import { Spacing, Text } from '@/ui-lib';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import type { FallbackProps } from 'react-error-boundary';
import { Box, Stack, styled } from 'styled-system/jsx';
import CartControlSection from './CartControlSection';
import ProductDetailSection from './ProductDetailSection';
import ProductInfoSection from './ProductInfoSection';
import ThumbnailSection from './ThumbnailSection';

type ProductMainSectionProps = {
  productId: number;
};

function ProductMainSection({ productId }: ProductMainSectionProps) {
  const { data: product } = useSuspenseQuery(queries.product.detail(productId));

  return (
    <>
      <ThumbnailSection images={product.images} />
      <ProductInfoSection
        name={product.name}
        category={product.category}
        rating={product.rating}
        price={product.price}
      />
      <CartControlSection productId={product.id} stock={product.stock} />

      <Spacing size={2.5} />

      <ProductDetailSection description={product.detailDescription} />
    </>
  );
}

function ProductMainSectionSkeleton() {
  return (
    <>
      {/* Thumbnail Skeleton */}
      <styled.section css={{ bg: 'background.01_white' }}>
        <Box css={{ w: 'full', aspectRatio: 1, bg: 'neutral.04_gray', animation: 'pulse' }} />
        <Stack direction="row" gap={2} css={{ justifyContent: 'center', pt: 2, pb: 2 }}>
          {[1, 2, 3, 4].map(i => (
            <Box key={i} css={{ w: 12, h: 12, bg: 'neutral.04_gray', rounded: 'md', animation: 'pulse' }} />
          ))}
        </Stack>
      </styled.section>

      {/* ProductInfo Skeleton */}
      <styled.section css={{ bg: 'background.01_white', p: 5 }}>
        <Box css={{ w: 16, h: 5, bg: 'neutral.04_gray', rounded: 'md', animation: 'pulse' }} />
        <Spacing size={2} />
        <Box css={{ w: '60%', h: 6, bg: 'neutral.04_gray', rounded: 'md', animation: 'pulse' }} />
        <Spacing size={2} />
        <Box css={{ w: 24, h: 4, bg: 'neutral.04_gray', rounded: 'md', animation: 'pulse' }} />
        <Spacing size={4} />
        <Box css={{ w: 32, h: 8, bg: 'neutral.04_gray', rounded: 'md', animation: 'pulse' }} />
        <Spacing size={5} />
        <Box css={{ w: 'full', h: 10, bg: 'neutral.04_gray', rounded: 'md', animation: 'pulse' }} />
        <Spacing size={5} />
        <Box css={{ w: 'full', h: 12, bg: 'neutral.04_gray', rounded: 'xl', animation: 'pulse' }} />
      </styled.section>

      <Spacing size={2.5} />

      {/* ProductDetail Skeleton */}
      <styled.section css={{ bg: 'background.01_white', px: 5, pt: 5, pb: 6 }}>
        <Text variant="H2_Bold">상세 정보</Text>
        <Spacing size={4} />
        <Stack gap={2}>
          <Box css={{ w: 'full', h: 4, bg: 'neutral.04_gray', rounded: 'md', animation: 'pulse' }} />
          <Box css={{ w: '90%', h: 4, bg: 'neutral.04_gray', rounded: 'md', animation: 'pulse' }} />
          <Box css={{ w: '80%', h: 4, bg: 'neutral.04_gray', rounded: 'md', animation: 'pulse' }} />
        </Stack>
      </styled.section>
    </>
  );
}

function ProductMainSectionError({ resetErrorBoundary }: FallbackProps) {
  const queryClient = useQueryClient();

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: queries.product._def });
    resetErrorBoundary();
  };

  return <ErrorSection onRetry={handleRetry} />;
}

ProductMainSection.Skeleton = ProductMainSectionSkeleton;
ProductMainSection.Error = ProductMainSectionError;

export default ProductMainSection;
