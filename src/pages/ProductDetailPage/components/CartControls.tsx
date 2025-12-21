import { useCartAction } from '@/providers/CartProvider';
import { Button, Counter, Text } from '@/ui-lib';
import { useState } from 'react';
import { Divider, Flex } from 'styled-system/jsx';

type RemoveProps = {
  productId: number;
  stock: number;
  cartQuantity: number;
};

function Remove({ productId, stock, cartQuantity }: RemoveProps) {
  const { removeFromCart } = useCartAction();

  return (
    <Flex direction="column" gap={5}>
      <Flex justify="space-between" alignItems="center">
        <StockInfo stock={stock} />
        <Counter.Root>
          <Counter.Minus disabled />
          <Counter.Display value={cartQuantity} />
          <Counter.Plus disabled />
        </Counter.Root>
      </Flex>
      <Button fullWidth color="primary" size="lg" onClick={() => removeFromCart(productId)}>
        장바구니에서 제거
      </Button>
    </Flex>
  );
}

type AddProps = {
  productId: number;
  stock: number;
};

function Add({ productId, stock }: AddProps) {
  const localCart = useLocalCart(stock);
  const { addItemWithQuantity } = useCartAction();

  const handleAddToCart = () => {
    addItemWithQuantity(productId, localCart.quantity);
    localCart.reset();
  };

  return (
    <Flex direction="column" gap={5}>
      <Flex justify="space-between" alignItems="center">
        <StockInfo stock={stock} />
        <Counter.Root>
          <Counter.Minus onClick={localCart.decrease} disabled={localCart.isMinusDisabled} />
          <Counter.Display value={localCart.quantity} />
          <Counter.Plus onClick={localCart.increase} disabled={localCart.isPlusDisabled} />
        </Counter.Root>
      </Flex>
      <Button fullWidth color="primary" size="lg" onClick={handleAddToCart}>
        장바구니에 담기
      </Button>
    </Flex>
  );
}

function StockInfo({ stock }: { stock: number }) {
  return (
    <Flex alignItems="center" gap={2}>
      <Text variant="C1_Medium">재고</Text>
      <Divider orientation="vertical" color="border.01_gray" h={4} />
      <Text variant="C1_Medium" color="secondary.02_orange">
        {stock}EA
      </Text>
    </Flex>
  );
}

function useLocalCart(stock: number) {
  const [quantity, setQuantity] = useState(0);

  const decrease = () => setQuantity(prev => prev - 1);
  const increase = () => setQuantity(prev => prev + 1);
  const reset = () => setQuantity(0);

  const isMinusDisabled = quantity === 0;
  const isPlusDisabled = quantity >= stock;

  return { quantity, decrease, increase, reset, isMinusDisabled, isPlusDisabled };
}

const CartControls = {
  Remove,
  Add,
};

export default CartControls;
