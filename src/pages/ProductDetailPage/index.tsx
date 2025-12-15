import { Spacing } from '@/ui-lib';
import ProductDetailSection from './components/ProductDetailSection';
import ProductInfoSection from './components/ProductInfoSection';
import RecommendationSection from './components/RecommendationSection';
import ThumbnailSection from './components/ThumbnailSection';
import { AsyncBoundary } from '@/ui-lib/components/AsyncBoundary';
import { useParams } from 'react-router';
import { useProductDetail } from '@/lib/api/products/products.services';
import ErrorSection from '@/components/ErrorSection';

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productDetail = useProductDetail(Number(id));
  const { description, detailDescription, images } = productDetail.data;
  const isLoading = productDetail.isFetching;
  const isError = productDetail.isError;

  // TODO:  상품 상세, 추천 목록 스켈레톤 및 에러처리 필요 ( 12.15 ) 전체적인 로직 점검

  // 아쉬운점 -> currency 와 환율이 같은공간에서 관리하는게 좋을듯
  // 현재 환율은 컴포넌트 내부에서 관리하고 있지만, currency는 전역적으로 관리하고 있음
  // 이렇게 되면 환율이 변경될 때마다 컴포넌트를 리렌더링 해야 함
  // 환율은 전역적으로 관리하고 있는게 좋을듯

  // async boundary 와 관련해서 아쉬운점 -> 서스펜스 & 옵셔널

  return (
    <>
      <AsyncBoundary
        isLoading={isLoading}
        isError={isError}
        loadingFallback={<ProductDetailPageSkeleton />}
        errorFallback={
          <ErrorSection
            onRetry={() => {
              productDetail.refetch();
            }}
          />
        }
      >
        <ThumbnailSection images={images} />
        <ProductInfoSection product={productDetail.data} />

        <Spacing size={2.5} />

        <ProductDetailSection description={description + '\n' + detailDescription} />

        <Spacing size={2.5} />
      </AsyncBoundary>
      <RecommendationSection />
    </>
  );
}

export default ProductDetailPage;

const ProductDetailPageSkeleton = () => {
  return (
    <div>
      <div>Loading...</div>
    </div>
  );
};
