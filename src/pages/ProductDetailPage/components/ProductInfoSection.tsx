import { useState } from 'react';
import { Button, Counter, RatingGroup, Spacing, Text } from '@/ui-lib';
import { Box, Divider, Flex, Stack, styled } from 'styled-system/jsx';
import { useShoppingCartController } from '@/hooks/useShoppingCart';
import type { Product } from '@/lib/types/products';
import { useCurrencyContext } from '@/providers/CurrencyProvider';
import { useExchangeRate } from '@/lib/api/common';
import Tag, { type TagType } from '@/ui-lib/components/tag';
import { convertCurrencyPrice } from '@/utils/calculate';
import { formatCurrencyPrice } from '@/utils/format';
import { getItemQuantity, isMoreThanStock, isLessThanStock } from '@/utils/shoppingCart';

// 아쉬운점
// 현재는 배열로해서 item, items 로 관리하고 있지만 객체로 관리하는게 좋을까?
// 객체로 관리하면 상품의 수량을 관리할 수 있고, 배열로 관리하면 상품의 수량을 관리할 수 없음
// shoppingCart와 임시 장바구니가 필요한 로직을 순수함수로 빼서 유틸로 만들어서 사용하는게 맞는걸까

type ProductInfoSectionProps = {
  product: Product;
};

function ProductInfoSection({ product }: ProductInfoSectionProps) {
  const { shoppingCart, addItems, removeItems } = useShoppingCartController();
  const { id, name, category, rating, price, stock } = product;
  const { currency } = useCurrencyContext();
  const exchangeRate = useExchangeRate();
  const hasProductInShoppingCart = shoppingCart.some(item => item.id === id);
  const [tmpShoppingCart, setTmpShoppingCart] = useState<Product[]>([]);

  const handleCounterDisabled = (callback: () => boolean): boolean => {
    if (hasProductInShoppingCart) {
      return true;
    }

    return callback();
  };

  const shoppingCartAction = {
    tmpAdd: () => setTmpShoppingCart(prev => [...prev, product]),
    tmpRemove: () => setTmpShoppingCart(prev => prev.slice(0, -1)),
    add: () => addItems(tmpShoppingCart),
    remove: () => {
      removeItems(id);
      setTmpShoppingCart([]);
    },
  };

  const ShoppingCartButton = () => {
    if (hasProductInShoppingCart) {
      return (
        <Button fullWidth color="primary" size="lg" onClick={() => shoppingCartAction.remove()}>
          장바구니에서 제거
        </Button>
      );
    }

    return (
      <Button fullWidth color="primary" size="lg" onClick={() => shoppingCartAction.add()}>
        장바구니 담기
      </Button>
    );
  };

  return (
    <styled.section css={{ bg: 'background.01_white', p: 5 }}>
      {/* 상품 정보 */}
      <Box>
        <Stack gap={2}>
          <Tag type={category.toLowerCase() as TagType} />
          <Text variant="B1_Bold">{name}</Text>
          <RatingGroup value={rating} readOnly label={`${rating.toFixed(1)}`} />
        </Stack>
        <Spacing size={4} />
        <Text variant="H1_Bold">
          {formatCurrencyPrice(convertCurrencyPrice(price, currency, exchangeRate.data), currency)}
        </Text>
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
            onClick={() => shoppingCartAction.tmpRemove()}
            disabled={handleCounterDisabled(() => isLessThanStock(tmpShoppingCart, product))}
          />
          <Counter.Display value={getItemQuantity(tmpShoppingCart, product)} />
          <Counter.Plus
            onClick={() => shoppingCartAction.tmpAdd()}
            disabled={handleCounterDisabled(() => isMoreThanStock(tmpShoppingCart, product))}
          />
        </Counter.Root>
      </Flex>

      <Spacing size={5} />

      {/* 장바구니 버튼 */}
      <ShoppingCartButton />
    </styled.section>
  );
}

export default ProductInfoSection;
