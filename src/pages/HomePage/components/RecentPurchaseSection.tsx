import { Box, Flex, styled } from 'styled-system/jsx';
import { AsyncBoundary, Spacing, Text } from '@/ui-lib';
import { useCurrencyContext } from '@/providers/CurrencyProvider';
import { useRecentProductList } from '@/lib/api/products';
import { useExchangeRate } from '@/lib/api/common';
import { convertCurrencyPrice } from '@/utils/calculate';
import { formatCurrencyPrice } from '@/utils/format';
import ErrorSection from '@/components/ErrorSection';

function RecentPurchaseSection() {
  const { currency } = useCurrencyContext();
  const recentProducts = useRecentProductList();
  const exchangeRate = useExchangeRate();
  const isLoading = recentProducts.isFetching || exchangeRate.isFetching;
  const isError = recentProducts.isError || exchangeRate.isError;

  return (
    <styled.section css={{ px: 5, pt: 4, pb: 8 }}>
      <Text variant="H1_Bold">최근 구매한 상품</Text>

      <Spacing size={4} />

      <Flex
        css={{
          bg: 'background.01_white',
          px: 5,
          py: 4,
          gap: 4,
          rounded: '2xl',
        }}
        direction={'column'}
      >
        <AsyncBoundary
          isLoading={isLoading}
          isError={isError}
          loadingFallback={<RecentPurchaseSectionSkeleton />}
          errorFallback={
            <ErrorSection
              onRetry={() => {
                recentProducts.refetch();
                exchangeRate.refetch();
              }}
            />
          }
        >
          {recentProducts.data.map(product => (
            <Flex key={product.id} css={{ gap: 4 }}>
              <styled.img
                src={product.thumbnail}
                alt={product.name}
                css={{
                  w: '60px',
                  h: '60px',
                  objectFit: 'cover',
                  rounded: 'xl',
                }}
              />
              <Flex flexDir="column" gap={1}>
                <Text variant="B2_Medium">{product.name}</Text>
                <Text variant="H1_Bold">
                  {formatCurrencyPrice(convertCurrencyPrice(product.price, currency, exchangeRate.data), currency)}
                </Text>
              </Flex>
            </Flex>
          ))}
        </AsyncBoundary>
      </Flex>
    </styled.section>
  );
}

export default RecentPurchaseSection;

function RecentPurchaseSectionSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <Flex key={index} css={{ gap: 4, animation: 'skeleton-pulse 2s infinite' }}>
          <Box
            css={{
              w: '60px',
              h: '60px',
              rounded: 'xl',
              bg: 'gray.200',
            }}
          />
          <Flex flexDir="column" gap={2}>
            <Text variant="B2_Medium" css={{ w: '80px', h: '20px', rounded: 'lg', bg: 'gray.200' }} />
            <Text variant="H1_Bold" css={{ w: '100px', h: '20px', rounded: 'lg', bg: 'gray.200' }} />
          </Flex>
        </Flex>
      ))}
    </>
  );
}
