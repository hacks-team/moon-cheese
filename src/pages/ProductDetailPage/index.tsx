import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { useParams } from 'react-router';
import ErrorSection from '@/components/ErrorSection';
import { getProductDetailQueryOptions } from '@/remotes/queries/product';
import { Spacing } from '@/ui-lib';
import ProductDetailSection from './components/ProductDetailSection';
import ProductInfoSection from './components/ProductInfoSection';
import RecommendationSection from './components/RecommendationSection';
import ThumbnailSection from './components/ThumbnailSection';

function ProductDetailPageContainer() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const { data: product } = useSuspenseQuery(getProductDetailQueryOptions(productId));

  return (
    <>
      <ThumbnailSection images={product.images} />
      <ProductInfoSection product={product} />

      <Spacing size={2.5} />

      <ProductDetailSection description={product.detailDescription} />

      <Spacing size={2.5} />

      <RecommendationSection productId={productId} />
    </>
  );
}

function ProductDetailPage() {
  return (
    <ErrorBoundary fallback={<ErrorSection />}>
      <Suspense>
        <ProductDetailPageContainer />
      </Suspense>
    </ErrorBoundary>
  );
}

export default ProductDetailPage;
