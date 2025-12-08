import ErrorSection from '@/components/ErrorSection';
import { queries } from '@/queries';
import { SubGNB, Text } from '@/ui-lib';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import { Box, Center, Grid, styled } from 'styled-system/jsx';
import { filterProductsByCategory, type CategoryFilter } from '../utils/category';
import ProductCard from './ProductCard';

function ProductListSection() {
  const [currentTab, setCurrentTab] = useState<CategoryFilter>('all');

  return (
    <styled.section bg="background.01_white">
      <Box css={{ px: 5, pt: 5, pb: 4 }}>
        <Text variant="H1_Bold">판매중인 상품</Text>
      </Box>
      {/* UI Component인 SubGNB는 string으로 넓게 가져가는게 범용성이 좋으므로 as 사용하게 두는것 같다
      전에 제네릭 주입 UI컴포넌트 만들다가 피눈물 난 적 있었음...
       */}
      <SubGNB.Root value={currentTab} onValueChange={details => setCurrentTab(details.value as CategoryFilter)}>
        <SubGNB.List>
          <SubGNB.Trigger value="all">전체</SubGNB.Trigger>
          <SubGNB.Trigger value="cheese">치즈</SubGNB.Trigger>
          <SubGNB.Trigger value="cracker">크래커</SubGNB.Trigger>
          <SubGNB.Trigger value="tea">티</SubGNB.Trigger>
        </SubGNB.List>
      </SubGNB.Root>
      <ProductGrid category={currentTab} />
    </styled.section>
  );
}

interface ProductGridProps {
  category: CategoryFilter;
}

function ProductGrid({ category }: ProductGridProps) {
  const { data: productData } = useSuspenseQuery(queries.product.list);

  const products = productData.products;
  const filteredProducts = filterProductsByCategory(products, category);

  return (
    <Grid gridTemplateColumns="repeat(2, 1fr)" rowGap={9} columnGap={4} p={5}>
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Grid>
  );
}

function ProductListSectionSkeleton() {
  return (
    <styled.section bg="background.01_white">
      <Box css={{ px: 5, pt: 5, pb: 4 }}>
        <Text variant="H1_Bold">판매중인 상품</Text>
      </Box>
      <Center p={5} minH={200}>
        <Text variant="B2_Bold" color="neutral.02_gray">
          상품을 불러오는 중...
        </Text>
      </Center>
    </styled.section>
  );
}

function ProductListSectionError({ resetErrorBoundary }: FallbackProps) {
  return (
    <styled.section bg="background.01_white">
      <Box css={{ px: 5, pt: 5, pb: 4 }}>
        <Text variant="H1_Bold">판매중인 상품</Text>
      </Box>
      <ErrorSection onRetry={resetErrorBoundary} />
    </styled.section>
  );
}

ProductListSection.Skeleton = ProductListSectionSkeleton;
ProductListSection.Error = ProductListSectionError;

export default ProductListSection;
