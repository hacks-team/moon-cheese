import { Flex, styled } from 'styled-system/jsx';
import { Spacing, Text } from '@/ui-lib';
import ErrorSection from '@/components/ErrorSection';
import { useCurrency } from '@/providers/CurrencyProvider';
import { formatPrice } from '@/utils/price';
import { useSuspenseQueries } from '@tanstack/react-query';
import { exchangeQueryOptions } from '@/remotes/queries/exchange';
import { productQueryOptions } from '@/remotes/queries/product';
import { type ReactNode } from 'react';
import AsyncBoundary from '@/components/AsyncBoundary';

const RecentPurchaseSection = () => {
  return (
    <AsyncBoundary
      suspenseFallback={<RecentPurchaseSkeleton />}
      errorFallback={({ onRetry }) => <ErrorSection onRetry={onRetry} />}
    >
      <RecentPurchaseSectionContainer />
    </AsyncBoundary>
  );
};

const RecentPurchaseSectionContainer = () => {
  const { currency } = useCurrency();

  const [{ data: exchangeRate }, { data: recentProducts }] = useSuspenseQueries({
    queries: [exchangeQueryOptions.exchangeRate(), productQueryOptions.recentProductList()],
  });

  return (
    <SectionWrapper>
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
        {recentProducts.map(product => {
          return (
            <Flex
              key={product.id}
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
                <Text variant="H1_Bold">{formatPrice(product.price, currency, exchangeRate)}</Text>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </SectionWrapper>
  );
};

// 레이아웃 컴포넌트
const SectionWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <styled.section css={{ px: 5, pt: 4, pb: 8 }}>
      <Text variant="H1_Bold">최근 구매한 상품</Text>

      <Spacing size={4} />

      {children}
    </styled.section>
  );
};

const RecentPurchaseSkeleton = () => {
  return (
    <SectionWrapper>
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
        {[1, 2, 3].map(i => (
          <Flex key={i} css={{ gap: 4 }}>
            {/* 이미지 스켈레톤 */}
            <styled.div
              css={{ w: '60px', h: '60px', rounded: 'xl', bg: 'background.02_light-gray', animation: 'skeleton-pulse' }}
            />
            <Flex flexDir="column" gap={1}>
              {/* 이름 스켈레톤 */}
              <styled.div
                css={{
                  w: '120px',
                  h: '20px',
                  rounded: 'md',
                  bg: 'background.02_light-gray',
                  animation: 'skeleton-pulse',
                }}
              ></styled.div>
              {/* 가격 스켈레톤 */}
              <styled.div
                css={{
                  w: '80px',
                  h: '24px',
                  rounded: 'md',
                  bg: 'background.02_light-gray',
                  animation: 'skeleton-pulse',
                }}
              ></styled.div>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </SectionWrapper>
  );
};

export default RecentPurchaseSection;
