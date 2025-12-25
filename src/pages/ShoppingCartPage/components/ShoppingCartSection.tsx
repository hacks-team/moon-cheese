import { CATEGORY_TO_TAG_TYPE } from '@/constants/product';
import { useCartAction, useCartValue } from '@/providers/CartProvider';
import { useCurrencyContext } from '@/providers/CurrencyProvider';
import { queries } from '@/queries';
import type { ExchangeRate } from '@/types/currency';
import type { Product } from '@/types/product';
import { Button, Counter, Spacing, Text } from '@/ui-lib';
import { formatPrice } from '@/utils/currency';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Divider, Flex, Stack, styled } from 'styled-system/jsx';
import ShoppingCartItem from './ShoppingCartItem';

type CartItem = { productId: number; quantity: number };
type CartItemWithProduct = CartItem & { product: Product };

function ShoppingCartSection() {
  const { clearCart } = useCartAction();

  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Flex justify="space-between">
        <Text variant="H2_Bold">장바구니</Text>
        <Button color={'neutral'} size="sm" onClick={clearCart}>
          전체삭제
        </Button>
      </Flex>
      <Spacing size={4} />
      <CartItemList />
    </styled.section>
  );
}

/** 장바구니 아이템에 상품 정보를 매핑
 * flatMap을 사용하여 type에서 falsy 값을 제거
 * 대규모 데이터 처리시 map 정규화가 필요하지만 프로덕트 특성상 그럴일 없어보임
 */
function mergeCartWithProducts(cartItems: CartItem[], products: Product[]): CartItemWithProduct[] {
  return cartItems.flatMap(cartItem => {
    const product = products.find(p => p.id === cartItem.productId);
    return product ? { ...cartItem, product } : [];
  });
}

function CartItemList() {
  const { items } = useCartValue();

  const [{ data: productData }, { data: exchangeRateData }] = useSuspenseQueries({
    queries: [queries.product.list, queries.exchangeRate.current],
  });

  const cartItemsWithProduct = useMemo(
    () => mergeCartWithProducts(items, productData.products),
    [items, productData.products]
  );

  return (
    <Stack
      gap={5}
      css={{
        p: 5,
        border: '1px solid',
        borderColor: 'border.01_gray',
        rounded: '2xl',
      }}
    >
      {cartItemsWithProduct.map((item, index) => (
        <CartItem key={item.productId} item={item} index={index} exchangeRate={exchangeRateData.exchangeRate} />
      ))}
    </Stack>
  );
}

interface CartItemProps {
  item: CartItemWithProduct;
  index: number;
  exchangeRate: ExchangeRate;
}

function CartItem({ item, index, exchangeRate }: CartItemProps) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCartAction();
  const [currency] = useCurrencyContext();

  const { productId, quantity, product } = item;

  return (
    <>
      {index > 0 && <Divider color="border.01_gray" />}
      <ShoppingCartItem.Root>
        <ShoppingCartItem.Image src={product.images[0]} alt={product.name} />
        <ShoppingCartItem.Content>
          <ShoppingCartItem.Info
            type={CATEGORY_TO_TAG_TYPE[product.category]}
            title={product.name}
            description={product.description}
            onDelete={() => removeFromCart(productId)}
          />
          <ShoppingCartItem.Footer>
            <ShoppingCartItem.Price>{formatPrice(product.price, currency, exchangeRate)}</ShoppingCartItem.Price>
            <Counter.Root>
              <Counter.Minus onClick={() => decreaseQuantity(productId)} disabled={false} />
              <Counter.Display value={quantity} />
              <Counter.Plus onClick={() => increaseQuantity(productId)} />
            </Counter.Root>
          </ShoppingCartItem.Footer>
        </ShoppingCartItem.Content>
      </ShoppingCartItem.Root>
    </>
  );
}

function ShoppingCartSectionSkeleton() {
  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Flex justify="space-between">
        <Text variant="H2_Bold">장바구니</Text>
        <Button color={'neutral'} size="sm" disabled>
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
        {[1, 2, 3].map(i => (
          <Flex key={i} gap={4}>
            <styled.div css={{ w: '60px', h: '60px', bg: 'neutral.04_gray', rounded: 'lg', animation: 'pulse' }} />
            <Flex flexDir="column" gap={2} flex={1}>
              <styled.div css={{ w: '80px', h: '20px', bg: 'neutral.04_gray', rounded: 'md', animation: 'pulse' }} />
              <styled.div css={{ w: '120px', h: '16px', bg: 'neutral.04_gray', rounded: 'md', animation: 'pulse' }} />
              <styled.div css={{ w: '60px', h: '24px', bg: 'neutral.04_gray', rounded: 'md', animation: 'pulse' }} />
            </Flex>
          </Flex>
        ))}
      </Stack>
    </styled.section>
  );
}

function ShoppingCartSectionError({ resetErrorBoundary }: { resetErrorBoundary: () => void }) {
  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Text variant="H2_Bold">장바구니</Text>
      <Spacing size={4} />
      <Stack
        gap={4}
        css={{
          p: 10,
          border: '1px solid',
          borderColor: 'border.01_gray',
          rounded: '2xl',
          textAlign: 'center',
        }}
      >
        <Text variant="B2_Bold">장바구니를 불러오는데 실패했습니다</Text>
        <Button onClick={resetErrorBoundary}>다시 시도</Button>
      </Stack>
    </styled.section>
  );
}

ShoppingCartSection.Skeleton = ShoppingCartSectionSkeleton;
ShoppingCartSection.Error = ShoppingCartSectionError;

export default ShoppingCartSection;
