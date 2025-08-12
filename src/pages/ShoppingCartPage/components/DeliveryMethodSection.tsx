import { useSuspenseQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Flex, Stack, styled } from 'styled-system/jsx';
import { formatPriceByCurrency } from '@/format/price';
import { useCart } from '@/provider/cart-provider';
import { useCurrency } from '@/provider/currency-provider';
import { useDelivery } from '@/provider/delivery-provider';
import { getGradeShippingQueryOptions, getMeQueryOptions } from '@/remotes/queries/me';
import { getProductListQueryOptions } from '@/remotes/queries/product';
import { Spacing, Text } from '@/ui-lib';
import { DeliveryIcon, RocketIcon } from '@/ui-lib/components/icons';

function DeliveryMethodSection() {
  const { selectedDeliveryMethod, setDeliveryMethod } = useDelivery();
  const { cartItems } = useCart();
  const { currency, exchangeRate } = useCurrency();

  const [
    {
      data: { grade },
    },
    {
      data: { gradeShippingList },
    },
    {
      data: { products },
    },
  ] = useSuspenseQueries({
    queries: [getMeQueryOptions, getGradeShippingQueryOptions, getProductListQueryOptions],
  });

  const totalAmount = useMemo(() => {
    return cartItems.reduce((total, cartItem) => {
      const product = products.find(p => p.id === cartItem.productId);
      return total + (product ? product.price * cartItem.quantity : 0);
    }, 0);
  }, [cartItems, products]);

  const getDeliveryPrice = (method: 'Express' | 'Premium') => {
    if (method === 'Express') {
      // Express는 모든 등급에서 무료
      return 0;
    } else {
      // Premium 배송비: $30 이상이면 모든 등급 무료, $30 미만이면 등급별 차등
      if (totalAmount >= 30) {
        return 0;
      } else {
        if (grade === 'EXPLORER') return 2;
        if (grade === 'PILOT') return 1;
        if (grade === 'COMMANDER') return 0; // Commander는 항상 무료
        return 2;
      }
    }
  };

  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Text variant="H2_Bold">배송 방식</Text>

      <Spacing size={4} />

      <Stack gap={4}>
        <DeliveryItem
          title="Express"
          description="2~3일"
          icon={<DeliveryIcon size={28} />}
          price={getDeliveryPrice('Express')}
          currency={currency}
          exchangeRate={exchangeRate}
          isSelected={selectedDeliveryMethod === 'Express'}
          onClick={() => setDeliveryMethod('Express')}
        />
        <DeliveryItem
          title="Premium"
          description="당일"
          icon={<RocketIcon size={28} />}
          price={getDeliveryPrice('Premium')}
          currency={currency}
          exchangeRate={exchangeRate}
          isSelected={selectedDeliveryMethod === 'Premium'}
          onClick={() => setDeliveryMethod('Premium')}
        />
      </Stack>
    </styled.section>
  );
}

function DeliveryItem({
  title,
  description,
  icon,
  price,
  currency,
  exchangeRate,
  isSelected,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  price: number;
  currency: 'KRW' | 'USD';
  exchangeRate: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Flex
      gap={3}
      css={{
        alignItems: 'center',
        p: 5,
        py: 4,
        bgColor: isSelected ? 'primary.01_primary' : 'background.02_light-gray',
        transition: 'background-color 0.3s ease',
        rounded: '2xl',
        color: isSelected ? 'neutral.05_white' : 'neutral.01_black',
        cursor: 'pointer',
      }}
      role="button"
      onClick={onClick}
    >
      {icon}

      <Flex flexDir="column" gap={1} flex={1}>
        <Text variant="B2_Regular" fontWeight={'semibold'} color={isSelected ? 'neutral.05_white' : 'neutral.01_black'}>
          {title}
        </Text>
        <Text variant="C2_Medium" color={isSelected ? 'neutral.05_white' : 'neutral.02_gray'}>
          {description}
        </Text>
      </Flex>
      <Text variant="B2_Medium" fontWeight={'semibold'} color={isSelected ? 'neutral.05_white' : 'neutral.01_black'}>
        {price === 0 ? '무료' : formatPriceByCurrency(price * exchangeRate, currency)}
      </Text>
    </Flex>
  );
}

export default DeliveryMethodSection;
