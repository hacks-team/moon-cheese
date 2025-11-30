import ErrorSection from '@/components/ErrorSection';
import { useCurrencyContext } from '@/providers/CurrencyProvider';
import { queries } from '@/queries';
import { Spacing, Text } from '@/ui-lib';
import { formatPrice } from '@/utils/currency';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import { Flex, styled } from 'styled-system/jsx';

/** 메인: 데이터 분기 담당 */
function RecentPurchaseSection() {
  const { data } = useSuspenseQuery(queries.recentProduct.list);

  if (data.recentProducts.length === 0) {
    return <RecentPurchaseSectionEmpty />;
  }

  return <RecentPurchaseSectionList />;
}

/** 빈 상품 목록 UI */
function RecentPurchaseSectionEmpty() {
  return (
    <SectionWrapper>
      <Flex
        css={{
          bg: 'background.01_white',
          px: 5,
          py: 4,
          rounded: '2xl',
          justifyContent: 'center',
          alignItems: 'center',
          minH: 24,
        }}
      >
        <Text variant="B2_Medium" color="neutral.03_gray">
          최근 구매한 상품이 없어요
        </Text>
      </Flex>
    </SectionWrapper>
  );
}

/** 상품 목록 UI */
function RecentPurchaseSectionList() {
  const [currency] = useCurrencyContext();
  const { data } = useSuspenseQuery(queries.recentProduct.list);
  const { data: exchangeRateData } = useSuspenseQuery(queries.exchangeRate.current);

  const recentProducts = data.recentProducts;
  const exchangeRate = exchangeRateData.exchangeRate;

  return (
    <SectionWrapper>
      <ContentBox>
        {recentProducts.map(product => (
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
              <Text variant="H1_Bold">{formatPrice(product.price, currency, exchangeRate)}</Text>
            </Flex>
          </Flex>
        ))}
      </ContentBox>
    </SectionWrapper>
  );
}

function SectionWrapper({ children }: { children: ReactNode }) {
  return (
    <styled.section css={{ px: 5, pt: 4, pb: 8 }}>
      <Text variant="H1_Bold">최근 구매한 상품</Text>
      <Spacing size={4} />
      {children}
    </styled.section>
  );
}

function ContentBox({ children }: { children: ReactNode }) {
  return (
    <Flex
      css={{
        bg: 'background.01_white',
        px: 5,
        py: 4,
        gap: 4,
        rounded: '2xl',
      }}
      direction="column"
    >
      {children}
    </Flex>
  );
}

function RecentPurchaseSectionSkeleton() {
  return (
    <SectionWrapper>
      <ContentBox>
        {[1, 2].map(i => (
          <Flex key={i} css={{ gap: 4 }}>
            <styled.div
              css={{
                w: '60px',
                h: '60px',
                bg: 'neutral.04_gray',
                rounded: 'xl',
                animation: 'pulse',
              }}
            />
            <Flex flexDir="column" gap={1} flex={1}>
              <styled.div css={{ w: '60%', h: 5, bg: 'neutral.04_gray', rounded: 'md' }} />
              <styled.div css={{ w: '30%', h: 6, bg: 'neutral.04_gray', rounded: 'md' }} />
            </Flex>
          </Flex>
        ))}
      </ContentBox>
    </SectionWrapper>
  );
}

function RecentPurchaseSectionError({ resetErrorBoundary }: FallbackProps) {
  const queryClient = useQueryClient();

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: queries.recentProduct.list.queryKey });
    resetErrorBoundary();
  };

  return (
    <SectionWrapper>
      <ErrorSection onRetry={handleRetry} />
    </SectionWrapper>
  );
}

RecentPurchaseSection.Skeleton = RecentPurchaseSectionSkeleton;
RecentPurchaseSection.Error = RecentPurchaseSectionError;

export default RecentPurchaseSection;
