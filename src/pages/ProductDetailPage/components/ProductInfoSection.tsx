import { useState } from 'react';
import { Box, Divider, Flex, Stack, styled } from 'styled-system/jsx';
import { formatPriceByCurrency } from '@/format/price';
import { useCart } from '@/provider/cart-provider';
import { useCurrency } from '@/provider/currency-provider';
import type { Product } from '@/types';
import { Button, Counter, RatingGroup, Spacing, Text } from '@/ui-lib';
import Tag, { type TagType } from '@/ui-lib/components/tag';

type ProductInfoSectionProps = {
  product: Product;
};

function getTagTypeFromCategory(category: Product['category']): TagType {
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

function ProductInfoSection({ product }: ProductInfoSectionProps) {
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const { currency, exchangeRate } = useCurrency();
  const { addToCart, removeFromCart, getCartItemQuantity, clearCartItem } = useCart();

  const cartQuantity = getCartItemQuantity(product.id);
  const isInCart = cartQuantity > 0;

  const handleIncrement = () => {
    if (selectedQuantity < product.stock) {
      setSelectedQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (selectedQuantity > 0) {
      setSelectedQuantity(prev => prev - 1);
    }
  };

  const handleCartAction = () => {
    if (isInCart) {
      // 장바구니에서 제거
      clearCartItem(product.id);
    } else {
      // 장바구니에 추가
      if (selectedQuantity > 0) {
        addToCart(product.id, selectedQuantity);
        setSelectedQuantity(0);
      }
    }
  };

  const isPlusDisabled = isInCart || selectedQuantity >= product.stock;
  const isMinusDisabled = isInCart || selectedQuantity === 0;
  const isCartButtonDisabled = !isInCart && selectedQuantity === 0;

  return (
    <styled.section css={{ bg: 'background.01_white', p: 5 }}>
      {/* 상품 정보 */}
      <Box>
        <Stack gap={2}>
          <Tag type={getTagTypeFromCategory(product.category)} />
          <Text variant="B1_Bold">{product.name}</Text>
          <RatingGroup value={product.rating} readOnly label={`${product.rating.toFixed(1)}`} />
        </Stack>
        <Spacing size={4} />
        <Text variant="H1_Bold">{formatPriceByCurrency(product.price * exchangeRate, currency)}</Text>
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
          <Counter.Minus onClick={handleDecrement} disabled={isMinusDisabled} />
          <Counter.Display value={isInCart ? cartQuantity : selectedQuantity} />
          <Counter.Plus onClick={handleIncrement} disabled={isPlusDisabled} />
        </Counter.Root>
      </Flex>

      <Spacing size={5} />

      {/* 장바구니 버튼 */}
      <Button fullWidth color="primary" size="lg" onClick={handleCartAction} disabled={isCartButtonDisabled}>
        {isInCart ? '장바구니에서 제거' : '장바구니 담기'}
      </Button>
    </styled.section>
  );
}

export default ProductInfoSection;
