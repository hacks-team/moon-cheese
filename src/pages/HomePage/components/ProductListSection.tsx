import { AsyncBoundary, Counter, SubGNB, Text } from '@/ui-lib';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Grid, styled } from 'styled-system/jsx';
import ProductItem from '../components/ProductItem';
import { useProductList } from '@/lib/api/products';
import { useExchangeRate } from '@/lib/api/common';
import type { Product } from '@/lib/types/products';
import { useCurrencyContext } from '@/providers/CurrencyProvider';
import { convertCurrencyPrice } from '@/utils/calculate';
import { formatCurrencyPrice } from '@/utils/format';
import { useShoppingCartController } from '@/hooks/useShoppingCart';
import ErrorSection from '@/components/ErrorSection';

function ProductListSection() {
  const [currentTab, setCurrentTab] = useState('all');
  const navigate = useNavigate();
  const productList = useProductList();
  const { currency } = useCurrencyContext();
  const exchangeRate = useExchangeRate();
  const { addItem, removeItem, readItemQuantity, isItemMoreThanStock, isItemLessThanStock } =
    useShoppingCartController();
  const isLoading = productList.isFetching || exchangeRate.isFetching;
  const isError = productList.isError || exchangeRate.isError;

  const handleClickProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const productListWithTab = (currentTab: string) => {
    if (currentTab === 'all') {
      return productList.data;
    }

    return productList.data.filter(product => product.category === currentTab.toUpperCase());
  };

  return (
    <styled.section bg="background.01_white">
      <Box css={{ px: 5, pt: 5, pb: 4 }}>
        <Text variant="H1_Bold">판매중인 상품</Text>
      </Box>
      <SubGNB.Root value={currentTab} onValueChange={details => setCurrentTab(details.value)}>
        <SubGNB.List>
          <SubGNB.Trigger value="all">전체</SubGNB.Trigger>
          <SubGNB.Trigger value="cheese">치즈</SubGNB.Trigger>
          <SubGNB.Trigger value="cracker">크래커</SubGNB.Trigger>
          <SubGNB.Trigger value="tea">티</SubGNB.Trigger>
        </SubGNB.List>
      </SubGNB.Root>
      <Grid gridTemplateColumns="repeat(2, 1fr)" rowGap={9} columnGap={4} p={5}>
        <AsyncBoundary
          isLoading={isLoading}
          isError={isError}
          loadingFallback={<ProductListSectionSkeleton />}
          errorFallback={
            <ErrorSection
              onRetry={() => {
                productList.refetch();
                exchangeRate.refetch();
              }}
            />
          }
        >
          {productListWithTab(currentTab).map(product => (
            <ProductItem.Root key={product.id} onClick={() => handleClickProduct(product.id)}>
              <ProductItem.Image src={product.images[0]} alt={product.name} />
              <ProductItem.Info title={product.name} description={product.description} />
              <ProductItem.Meta>
                <ProductItem.MetaLeft>
                  <ProductItem.Rating rating={product.rating} />
                  <ProductItem.Price>
                    {formatCurrencyPrice(convertCurrencyPrice(product.price, currency, exchangeRate.data), currency)}
                  </ProductItem.Price>
                </ProductItem.MetaLeft>
                <ProductItemFreeTag product={product} />
              </ProductItem.Meta>
              <Counter.Root>
                <Counter.Minus onClick={() => removeItem(product.id)} disabled={isItemLessThanStock(product)} />
                <Counter.Display value={readItemQuantity(product)} />
                <Counter.Plus onClick={() => addItem(product)} disabled={isItemMoreThanStock(product)} />
              </Counter.Root>
            </ProductItem.Root>
          ))}
        </AsyncBoundary>
      </Grid>
    </styled.section>
  );
}

export default ProductListSection;

function ProductItemFreeTag({ product }: { product: Product }) {
  const category = product.category;

  switch (category) {
    case 'CHEESE':
      return;
    case 'CRACKER':
      return product.isGlutenFree && <ProductItem.FreeTag type="gluten" />;
    case 'TEA':
      return product.isCaffeineFree && <ProductItem.FreeTag type="caffeine" />;
    default:
      category satisfies never;
  }
}

function ProductListSectionSkeleton() {
  return (
    <Grid gridTemplateColumns="repeat(2, 1fr)" rowGap={40} columnGap={4} p={2}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Box key={index} css={{ animation: 'skeleton-pulse 2s infinite' }}>
          <Box css={{ w: 'full', h: 'full', bg: 'gray.200', rounded: 'lg' }} />
          <Box css={{ w: '100px', h: '12px', rounded: 'lg', bg: 'gray.200', marginTop: '4px' }} />
          <ProductItem.Meta>
            <ProductItem.MetaLeft>
              <Box css={{ w: '200px', h: '12px', rounded: 'lg', bg: 'gray.200' }} />
              <Box css={{ w: '100px', h: '12px', rounded: 'lg', bg: 'gray.200', marginTop: '4px' }} />
              <Box css={{ w: '50px', h: '12px', rounded: 'lg', bg: 'gray.200', marginTop: '4px' }} />
            </ProductItem.MetaLeft>
            <Box css={{ w: '30px', h: '20px', rounded: 'lg', bg: 'gray.200' }} />
          </ProductItem.Meta>
          <Counter.Root>
            <Box css={{ w: '20px', h: '20px', rounded: 'lg', bg: 'gray.200' }} />
            <Box css={{ w: '30px', h: '20px', rounded: 'lg', bg: 'gray.200', marginTop: '4px' }} />
            <Box css={{ w: '20px', h: '20px', rounded: 'lg', bg: 'gray.200' }} />
          </Counter.Root>
        </Box>
      ))}
    </Grid>
  );
}
