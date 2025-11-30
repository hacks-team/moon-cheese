import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import BannerSection from './components/BannerSection';
import CurrentLevelSection from './components/CurrentLevelSection';
import ProductListSection from './components/ProductListSection';
import RecentPurchaseSection from './components/RecentPurchaseSection';

function HomePage() {
  return (
    <>
      <BannerSection />
      <Suspense fallback={<CurrentLevelSection.Skeleton />}>
        <ErrorBoundary FallbackComponent={CurrentLevelSection.Error}>
          <CurrentLevelSection />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<RecentPurchaseSection.Skeleton />}>
        <ErrorBoundary FallbackComponent={RecentPurchaseSection.Error}>
          <RecentPurchaseSection />
        </ErrorBoundary>
      </Suspense>
      <ProductListSection />
    </>
  );
}

export default HomePage;
