import { Spacing } from '@/ui-lib';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router';
import ProductMainSection from './components/ProductMainSection';
import RecommendationSection from './components/RecommendationSection';

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  return (
    <>
      <Suspense fallback={<ProductMainSection.Skeleton />}>
        <ErrorBoundary FallbackComponent={ProductMainSection.Error}>
          <ProductMainSection productId={productId} />
        </ErrorBoundary>
      </Suspense>

      <Spacing size={2.5} />

      <Suspense fallback={<RecommendationSection.Skeleton />}>
        <ErrorBoundary FallbackComponent={RecommendationSection.Error}>
          <RecommendationSection productId={productId} />
        </ErrorBoundary>
      </Suspense>
    </>
  );
}

export default ProductDetailPage;
