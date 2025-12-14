import { useState } from 'react';
import { Box, Divider, Flex, Stack, styled } from 'styled-system/jsx';
import { formatPriceByCurrency } from '@/format/number';
import type { ProductCategory } from '@/models/product';
import { useCart } from '@/providers/cart-provider';
import { useCurrency } from '@/providers/currency-provider';
import type { Product } from '@/type';
import { Button, Counter, RatingGroup, Spacing, Text } from '@/ui-lib';
import Tag, { type TagType } from '@/ui-lib/components/tag';

type ProductInfoSectionProps = {
  product: Product;
};

function ProductInfoSection({ product }: ProductInfoSectionProps) {
  const [count, setCount] = useState(0);
  const { addCart, clearCart, carts } = useCart();
  const { currency, exchangeRate } = useCurrency();

  const isInCart = carts.some(cart => cart.id === product.id);

  return (
    <styled.section css={{ bg: 'background.01_white', p: 5 }}>
      {/* 상품 정보 */}
      <Box>
        <Stack gap={2}>
          <Tag type={getTagType(product.category) ?? 'cheese'} />
          <Text variant="B1_Bold">{product.name}</Text>
          <RatingGroup value={product.rating} readOnly label={`${product.rating.toFixed(1)}`} />
        </Stack>
        <Spacing size={4} />
        <Text variant="H1_Bold">{formatPriceByCurrency(product.price * exchangeRate[currency], currency)}</Text>
      </Box>

      <Spacing size={5} />

      {/* 재고 및 수량 조절 */}
      <Flex justify="space-between" alignItems="center">
        <Flex alignItems="center" gap={2}>
          <Text variant="C1_Medium">재고</Text>
          <Divider orientation="vertical" color="border.01_gray" h={4} />
          <Text variant="C1_Medium" color="secondary.02_orange">
            {product.stock}EA
          </Text>
        </Flex>
        <Counter.Root>
          <Counter.Minus
            onClick={() => {
              if (count > 0) {
                setCount(prev => prev - 1);
              }
            }}
            disabled={count === 0}
          />
          <Counter.Display value={count} />
          <Counter.Plus
            onClick={() => {
              if (product.stock > count) {
                setCount(prev => prev + 1);
              }
            }}
            disabled={isInCart || product.stock <= count}
          />
        </Counter.Root>
      </Flex>

      <Spacing size={5} />

      {/* 장바구니 버튼 */}
      <Button
        fullWidth
        color="primary"
        size="lg"
        onClick={() => {
          if (isInCart) {
            clearCart(product.id);
          } else {
            Array.from({ length: count }).forEach(() => {
              addCart(product);
            });
            setCount(0);
          }
        }}
      >
        {isInCart ? '장바구니에서 제거' : '장바구니 담기'}
      </Button>
    </styled.section>
  );
}

export default ProductInfoSection;

function getTagType(category: Exclude<ProductCategory, 'ALL'>): TagType | null {
  switch (category) {
    case 'CHEESE':
      return 'cheese';
    case 'CRACKER':
      return 'cracker';
    case 'TEA':
      return 'tea';
    default:
      category satisfies never;
      return null;
  }
}
