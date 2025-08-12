import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Divider, Flex, Stack, styled } from 'styled-system/jsx';
import { formatPriceByCurrency } from '@/format/price';
import { useCart } from '@/provider/cart-provider';
import { useCurrency } from '@/provider/currency-provider';
import { getProductListQueryOptions } from '@/remotes/queries/product';
import type { Product } from '@/types';
import { Button, Counter, Spacing, Text } from '@/ui-lib';
import ShoppingCartItem from './ShoppingCartItem';

function getTagTypeFromCategory(category: Product['category']) {
  switch (category) {
    case 'CHEESE':
      return 'cheese';
    case 'CRACKER':
      return 'cracker';
    case 'TEA':
      return 'tea';
    default:
      return 'cheese';
  }
}

function ShoppingCartSection() {
  const { cartItems, addToCart, removeFromCart, clearCart, clearCartItem } = useCart();
  const { currency, exchangeRate } = useCurrency();
  const {
    data: { products },
  } = useSuspenseQuery(getProductListQueryOptions);

  const cartProducts = useMemo(() => {
    return cartItems
      .map(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        return product ? { ...product, quantity: cartItem.quantity } : null;
      })
      .filter(Boolean) as (Product & { quantity: number })[];
  }, [cartItems, products]);

  const handleIncrement = (productId: number) => {
    addToCart(productId, 1);
  };

  const handleDecrement = (productId: number) => {
    removeFromCart(productId, 1);
  };

  const handleDelete = (productId: number) => {
    clearCartItem(productId);
  };

  const handleClearAll = () => {
    clearCart();
  };

  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Flex justify="space-between">
        <Text variant="H2_Bold">장바구니</Text>
        <Button color={'neutral'} size="sm" onClick={handleClearAll}>
          전체삭제
        </Button>
      </Flex>
      <Spacing size={4} />
      <Stack
        gap={5}
        css={{
          p: 5,
          border: '1px solid',
          borderColor: 'border.01_gray',
          rounded: '2xl',
        }}
      >
        {cartProducts.map((product, index) => (
          <div key={product.id}>
            <ShoppingCartItem.Root>
              <ShoppingCartItem.Image src={product.images[0]} alt={product.name} />
              <ShoppingCartItem.Content>
                <ShoppingCartItem.Info
                  type={getTagTypeFromCategory(product.category)}
                  title={product.name}
                  description={product.description}
                  onDelete={() => handleDelete(product.id)}
                />
                <ShoppingCartItem.Footer>
                  <ShoppingCartItem.Price>
                    {formatPriceByCurrency(product.price * exchangeRate, currency)}
                  </ShoppingCartItem.Price>
                  <Counter.Root>
                    <Counter.Minus onClick={() => handleDecrement(product.id)} disabled={product.quantity <= 1} />
                    <Counter.Display value={product.quantity} />
                    <Counter.Plus
                      onClick={() => handleIncrement(product.id)}
                      disabled={product.quantity >= product.stock}
                    />
                  </Counter.Root>
                </ShoppingCartItem.Footer>
              </ShoppingCartItem.Content>
            </ShoppingCartItem.Root>
            {index < cartProducts.length - 1 && <Divider color="border.01_gray" />}
          </div>
        ))}
      </Stack>
    </styled.section>
  );
}

export default ShoppingCartSection;
