import { ErrorBoundary } from '@suspensive/react';
import { Box, styled } from 'styled-system/jsx';
import ErrorSection from '@/components/ErrorSection';
import type { ProductCategory } from '@/models/product';
import { SubGNB, Text } from '@/ui-lib';
import { useProductCategorySeachParams } from '../hooks/useProductCategorySearchParams';
import { ProductList } from './product/ProductList';

function ProductListSectionContainer() {
  const {
    filter: { category },
    updateFilter,
  } = useProductCategorySeachParams();

  return (
    <styled.section bg="background.01_white">
      <Box css={{ px: 5, pt: 5, pb: 4 }}>
        <Text variant="H1_Bold">판매중인 상품</Text>
      </Box>
      <SubGNB.Root value={category} onValueChange={({ value }) => updateFilter(value as ProductCategory)}>
        <SubGNB.List>
          <SubGNB.Trigger value="ALL">전체</SubGNB.Trigger>
          <SubGNB.Trigger value="CHEESE">치즈</SubGNB.Trigger>
          <SubGNB.Trigger value="CRACKER">크래커</SubGNB.Trigger>
          <SubGNB.Trigger value="TEA">티</SubGNB.Trigger>
        </SubGNB.List>
      </SubGNB.Root>
      <ProductList category={category} />
    </styled.section>
  );
}

const ProductListSection = ErrorBoundary.with(
  { fallback: ({ reset }) => <ErrorSection onRetry={reset} /> },
  ProductListSectionContainer
);

export default ProductListSection;
