import { Button, Counter, Spacing, Text } from '@/ui-lib';
import { Divider, Flex, Stack, styled } from 'styled-system/jsx';
import ShoppingCartItem from './ShoppingCartItem';
import { useCart } from '@/providers/cart-provider';
import { uniq } from 'es-toolkit';
import { Fragment } from 'react/jsx-runtime';
import { useCurrency } from '@/providers/currency-provider';
import { formatPriceByCurrency } from '@/format/number';
import { getCartCount } from '@/utils/cart';

const CategoryToTagType = {
  CHEESE: 'cheese',
  TEA: 'tea',
  CRACKER: 'cracker',
} as const;

function ShoppingCartSection() {
  const { carts, addCart: increase, removeCart: decrease, clearCart, resetCart } = useCart();
  const { currency, exchangeRate } = useCurrency();

  const uniqueCarts = uniq(carts);

  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Flex justify="space-between">
        <Text variant="H2_Bold">장바구니</Text>
        <Button
          color={'neutral'}
          size="sm"
          onClick={() => {
            resetCart();
          }}
        >
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
        {uniqueCarts.map((cart, index) => {
          const isLastItem = index === uniqueCarts.length - 1;
          const isDisabledPlusButton = getCartCount(cart.id, carts) >= cart.stock;
          return (
            <Fragment key={cart.id}>
              <ShoppingCartItem.Root>
                <ShoppingCartItem.Image src={cart.images[0]} alt={cart.name} />
                <ShoppingCartItem.Content>
                  <ShoppingCartItem.Info
                    type={CategoryToTagType[cart.category]}
                    title={cart.name}
                    description={cart.description}
                    onDelete={() => {
                      clearCart(cart.id);
                    }}
                  />
                  <ShoppingCartItem.Footer>
                    <ShoppingCartItem.Price>
                      {formatPriceByCurrency(cart.price * exchangeRate[currency], currency)}
                    </ShoppingCartItem.Price>
                    <Counter.Root>
                      <Counter.Minus
                        onClick={() => {
                          decrease(cart);
                        }}
                      />
                      <Counter.Display value={getCartCount(cart.id, carts)} />
                      <Counter.Plus
                        onClick={() => {
                          if (isDisabledPlusButton) return;
                          increase(cart);
                        }}
                        disabled={isDisabledPlusButton}
                      />
                    </Counter.Root>
                  </ShoppingCartItem.Footer>
                </ShoppingCartItem.Content>
              </ShoppingCartItem.Root>

              {!isLastItem ? <Divider color="border.01_gray" /> : null}
            </Fragment>
          );
        })}
      </Stack>
    </styled.section>
  );
}

export default ShoppingCartSection;
