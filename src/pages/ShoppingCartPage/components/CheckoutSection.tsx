import { useMutation, useSuspenseQueries } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Divider, Flex, HStack, Stack, styled } from 'styled-system/jsx';
import { SECOND } from '@/constants/time';
import { formatPriceByCurrency } from '@/format/price';
import { useCart } from '@/provider/cart-provider';
import { useCurrency } from '@/provider/currency-provider';
import { useDelivery } from '@/provider/delivery-provider';
import { purchaseProducts } from '@/remotes/fetchers/me';
import { getGradeShippingQueryOptions, getMeQueryOptions } from '@/remotes/queries/me';
import { getProductListQueryOptions } from '@/remotes/queries/product';
import { Button, Spacing, Text } from '@/ui-lib';
import { toast } from '@/ui-lib/components/toast';
import { delay } from '@/utils/async';

function CheckoutSection() {
  const navigate = useNavigate();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { cartItems, clearCart } = useCart();
  const { currency, exchangeRate } = useCurrency();
  const { selectedDeliveryMethod } = useDelivery();

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

  const purchaseMutation = useMutation({
    mutationFn: purchaseProducts,
  });

  const { totalAmount, totalQuantity, deliveryFee, finalAmount } = useMemo(() => {
    const totalAmount = cartItems.reduce((total, cartItem) => {
      const product = products.find(p => p.id === cartItem.productId);
      return total + (product ? product.price * cartItem.quantity : 0);
    }, 0);

    const totalQuantity = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);

    let deliveryFee = 0;

    if (selectedDeliveryMethod === 'Express') {
      // Express는 모든 등급에서 무료
      deliveryFee = 0;
    } else {
      // Premium 배송비: $30 이상이면 모든 등급 무료, $30 미만이면 등급별 차등
      if (totalAmount >= 30) {
        deliveryFee = 0;
      } else {
        if (grade === 'EXPLORER') deliveryFee = 2;
        else if (grade === 'PILOT') deliveryFee = 1;
        else if (grade === 'COMMANDER') deliveryFee = 0; // Commander는 항상 무료
      }
    }

    const finalAmount = totalAmount + deliveryFee;

    return { totalAmount, totalQuantity, deliveryFee, finalAmount };
  }, [cartItems, products, selectedDeliveryMethod, grade, gradeShippingList]);

  const onClickPurchase = async () => {
    setIsPurchasing(true);

    try {
      const purchaseData = {
        deliveryType: selectedDeliveryMethod.toUpperCase() as 'EXPRESS' | 'PREMIUM',
        totalPrice: finalAmount,
        items: cartItems,
      };

      await purchaseMutation.mutateAsync(purchaseData);
      await delay(SECOND * 1);
      toast.success('결제가 완료되었습니다.');
      clearCart();
      await delay(SECOND * 2);
      navigate('/');
    } catch (error) {
      toast.error('결제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const isFreeShipping = deliveryFee === 0;

  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Text variant="H2_Bold">결제금액</Text>

      <Spacing size={4} />

      <Stack
        gap={6}
        css={{
          p: 5,
          border: '1px solid',
          borderColor: 'border.01_gray',
          rounded: '2xl',
        }}
      >
        <Stack gap={5}>
          <Box gap={3}>
            <Flex justify="space-between">
              <Text variant="B2_Regular">주문금액({totalQuantity}개)</Text>
              <Text variant="B2_Bold">{formatPriceByCurrency(totalAmount * exchangeRate, currency)}</Text>
            </Flex>
            <Spacing size={3} />
            <Flex justify="space-between">
              <Text variant="B2_Regular">배송비</Text>
              <Text variant="B2_Bold" color={isFreeShipping ? 'state.green' : 'neutral.01_black'}>
                {isFreeShipping ? '무료' : formatPriceByCurrency(deliveryFee * exchangeRate, currency)}
              </Text>
            </Flex>
          </Box>

          <Divider color="border.01_gray" />

          <HStack justify="space-between">
            <Text variant="H2_Bold">총 금액</Text>
            <Text variant="H2_Bold">{formatPriceByCurrency(finalAmount * exchangeRate, currency)}</Text>
          </HStack>
        </Stack>

        <Button fullWidth size="lg" loading={isPurchasing} onClick={onClickPurchase} disabled={cartItems.length === 0}>
          {isPurchasing ? '결제 중...' : '결제 진행'}
        </Button>

        <Text variant="C2_Regular" color="neutral.03_gray">
          {`우리는 신용카드, 은행 송금, 모바일 결제, 현금을 받아들입니다\n안전한 체크아웃\n귀하의 결제 정보는 암호화되어 안전합니다.`}
        </Text>
      </Stack>
    </styled.section>
  );
}

export default CheckoutSection;
