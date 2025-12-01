import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Flex, styled } from 'styled-system/jsx';
import ErrorSection from '@/components/ErrorSection';
import { formatPriceByCurrency } from '@/format/number';
import { useCurrency } from '@/providers/currency-provider';
import { getExchangeRateQueryOptions } from '@/remotes/queries/exchange';
import { getRecentProductListQueryOptions } from '@/remotes/queries/product';
import { Spacing, Text } from '@/ui-lib';

function RecentPurchaseSectionContainer() {
  const [
    {
      data: { recentProducts },
    },
    {
      data: { exchangeRate },
    },
  ] = useSuspenseQueries({
    queries: [getRecentProductListQueryOptions(), getExchangeRateQueryOptions()],
  });

  const { currency } = useCurrency();

  return (
    <styled.section css={{ px: 5, pt: 4, pb: 8 }}>
      <Text variant="H1_Bold">최근 구매한 상품</Text>

      <Spacing size={4} />

      {recentProducts.map(product => {
        return (
          <Flex
            key={product.id}
            css={{
              bg: 'background.01_white',
              px: 5,
              py: 4,
              gap: 4,
              rounded: '2xl',
            }}
            direction={'column'}
          >
            <Flex
              css={{
                gap: 4,
              }}
            >
              <styled.img
                src={product.thumbnail}
                alt="item"
                css={{
                  w: '60px',
                  h: '60px',
                  objectFit: 'cover',
                  rounded: 'xl',
                }}
              />
              <Flex flexDir="column" gap={1}>
                <Text variant="B2_Medium">{product.name}</Text>
                <Text variant="H1_Bold">{formatPriceByCurrency(product.price * exchangeRate[currency], currency)}</Text>
              </Flex>
            </Flex>
          </Flex>
        );
      })}
    </styled.section>
  );
}

const RecentPurchaseSection = ErrorBoundary.with(
  {
    fallback: ({ reset }) => <ErrorSection onRetry={reset} />,
  },
  () => {
    return (
      <Suspense>
        <RecentPurchaseSectionContainer />
      </Suspense>
    );
  }
);

export default RecentPurchaseSection;
