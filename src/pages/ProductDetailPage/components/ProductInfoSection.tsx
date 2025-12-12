import { useShoppingCartActions, useShoppingCartState } from '@/providers/ShoppingCartProvider';
import type { Product } from '@/remotes/product';
import { Button, Counter, RatingGroup, Spacing, Text } from '@/ui-lib';
import Tag, { type TagType } from '@/ui-lib/components/tag';
import { useState } from 'react';
import { Box, Divider, Flex, Stack, styled } from 'styled-system/jsx';

type ProductInfoSectionProps = {
  product: Product;
  category: TagType;
  formattedPrice: string;
};

function ProductInfoSection({ product, category, formattedPrice }: ProductInfoSectionProps) {
  const { id, name, rating, stock } = product;
  const { items: cartItems } = useShoppingCartState();
  const { addToShoppingCart, removeFromShoppingCart } = useShoppingCartActions();

  const cartQuantity = cartItems.find(item => item.product.id === id)?.quantity ?? 0;

  const [quantity, setQunatity] = useState(cartQuantity);

  const handleClickCartButton = () => {
    if (cartQuantity > 0) {
      // 장바구니에서 제거
      removeFromShoppingCart(id);
    } else {
      // 장바구니에 수량만큼 추가
      addToShoppingCart(product, quantity || 1); // 0이면 1개 추가
    }
  };

  return (
    <styled.section css={{ bg: 'background.01_white', p: 5 }}>
      {/* 상품 정보 */}
      <Box>
        <Stack gap={2}>
          <Tag type={category} />
          <Text variant="B1_Bold">{name}</Text>
          <RatingGroup value={rating} readOnly label={`${rating.toFixed(1)}`} />
        </Stack>
        <Spacing size={4} />
        <Text variant="H1_Bold">{formattedPrice}</Text>
      </Box>

      <Spacing size={5} />

      {/* 재고 및 수량 조절 */}
      <Flex justify="space-between" alignItems="center">
        <Flex alignItems="center" gap={2}>
          <Text variant="C1_Medium">재고</Text>
          <Divider orientation="vertical" color="border.01_gray" h={4} />
          <Text variant="C1_Medium" color="secondary.02_orange">
            {stock}EA
          </Text>
        </Flex>
        <Counter.Root>
          <Counter.Minus
            onClick={() => {
              setQunatity(quantity - 1);
            }}
            disabled={cartQuantity !== 0 || quantity <= 0}
          />
          <Counter.Display value={quantity} />
          <Counter.Plus
            onClick={() => {
              setQunatity(quantity + 1);
            }}
            disabled={cartQuantity !== 0 || stock - quantity <= 0}
          />
        </Counter.Root>
      </Flex>

      <Spacing size={5} />

      {/* 장바구니 버튼 */}
      <Button fullWidth color="primary" size="lg" onClick={handleClickCartButton}>
        {cartQuantity > 0 ? '장바구니에서 제거' : '장바구니 담기'}
      </Button>
    </styled.section>
  );
}

export default ProductInfoSection;
