import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Grid, styled } from 'styled-system/jsx';
import ErrorSection from '@/components/ErrorSection';
import { formatPriceByCurrency } from '@/format/price';
import { useCart } from '@/provider/cart-provider';
import { useCurrency } from '@/provider/currency-provider';
import { getProductListQueryOptions } from '@/remotes/queries/product';
import type { Product, ProductCategory } from '@/types';
import { Counter, SubGNB, Text } from '@/ui-lib';
import ProductItem from './ProductItem';

function ProductListSectionContainer() {
  const [currentTab, setCurrentTab] = useState('all');
  const navigate = useNavigate();
  const { currency, exchangeRate } = useCurrency();
  const { addToCart, removeFromCart, getCartItemQuantity } = useCart();

  const {
    data: { products },
  } = useSuspenseQuery(getProductListQueryOptions);

  const filteredProducts = useMemo(() => {
    if (currentTab === 'all') {
      return products;
    }

    const categoryMap: Record<string, ProductCategory> = {
      cheese: 'CHEESE',
      cracker: 'CRACKER',
      tea: 'TEA',
    };

    return products.filter(product => product.category === categoryMap[currentTab]);
  }, [products, currentTab]);

  const handleClickProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (productId: number) => {
    addToCart(productId, 1);
  };

  const handleRemoveFromCart = (productId: number) => {
    removeFromCart(productId, 1);
  };

  const renderFreeTag = (product: Product) => {
    if (product.category === 'CRACKER' && product.isGlutenFree) {
      return <ProductItem.FreeTag type="gluten" />;
    }
    if (product.category === 'TEA' && product.isCaffeineFree) {
      return <ProductItem.FreeTag type="caffeine" />;
    }
    return null;
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
        {filteredProducts.map(product => {
          const cartQuantity = getCartItemQuantity(product.id);
          const isMinusDisabled = cartQuantity === 0;
          const isPlusDisabled = cartQuantity >= product.stock;

          return (
            <ProductItem.Root key={product.id} onClick={() => handleClickProduct(product.id)}>
              <ProductItem.Image src={product.images[0]} alt={product.name} />
              <ProductItem.Info title={product.name} description={product.description} />
              <ProductItem.Meta>
                <ProductItem.MetaLeft>
                  <ProductItem.Rating rating={product.rating} />
                  <ProductItem.Price>{formatPriceByCurrency(product.price * exchangeRate, currency)}</ProductItem.Price>
                </ProductItem.MetaLeft>
                {renderFreeTag(product)}
              </ProductItem.Meta>
              <Counter.Root>
                <Counter.Minus
                  onClick={e => {
                    e.stopPropagation();
                    handleRemoveFromCart(product.id);
                  }}
                  disabled={isMinusDisabled}
                />
                <Counter.Display value={cartQuantity} />
                <Counter.Plus
                  onClick={e => {
                    e.stopPropagation();
                    handleAddToCart(product.id);
                  }}
                  disabled={isPlusDisabled}
                />
              </Counter.Root>
            </ProductItem.Root>
          );
        })}
      </Grid>
    </styled.section>
  );
}

function ProductListSection() {
  return (
    <ErrorBoundary fallback={<ErrorSection />}>
      <Suspense>
        <ProductListSectionContainer />
      </Suspense>
    </ErrorBoundary>
  );
}

export default ProductListSection;
