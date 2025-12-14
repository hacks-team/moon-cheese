import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import ErrorSection from '@/components/ErrorSection';
import { getProductByIdQueryOptions } from '@/remotes/queries/product';
import { Spacing } from '@/ui-lib';
import ProductDetailSection from './ProductDetailSection';
import ProductInfoSection from './ProductInfoSection';
import ThumbnailSection from './ThumbnailSection';

interface ProductDetailContentContainerProps {
  productId: number;
}

const ProductDetailContentContainer = ({ productId }: ProductDetailContentContainerProps) => {
  const { data: product } = useSuspenseQuery(getProductByIdQueryOptions(productId));
  return (
    <>
      <ThumbnailSection images={product.images} />
      <ProductInfoSection product={product} />

      <Spacing size={2.5} />

      <ProductDetailSection
        description={
          '"달 표면에서 가 수확한 특별한 구멍낸 크래커." 달의 분화구를 연상시키는 다지한과 고소한 풍미가 특징인 크래커. 치즈와의 궁합을 고려한 절묘한 비율로, 어느 데어링 메뉴도 잘 어울립니다.'
        }
      />
    </>
  );
};

const ProductDetailContent = ErrorBoundary.with(
  {
    fallback: ({ reset }) => <ErrorSection onRetry={reset} />,
  },
  ({ productId }: ProductDetailContentContainerProps) => {
    return (
      <Suspense>
        <ProductDetailContentContainer productId={productId} />
      </Suspense>
    );
  }
);

export { ProductDetailContent };
