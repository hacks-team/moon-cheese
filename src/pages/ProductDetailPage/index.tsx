import { Spacing } from '@/ui-lib';
import { ProductDetailContent } from './components/ProductDetailContent';
import RecommendationSection from './components/RecommendationSection';
import { useProductIdParams } from './hooks/useProductIdParams';

function ProductDetailPage() {
  const productId = useProductIdParams();

  return (
    <>
      <ProductDetailContent productId={productId} />
      <Spacing size={2.5} />

      <RecommendationSection productId={productId} />
    </>
  );
}

export default ProductDetailPage;
