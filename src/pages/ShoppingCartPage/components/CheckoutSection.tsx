import { useTransition } from 'react';
import { useNavigate } from 'react-router';
import { Box, Divider, Flex, HStack, Stack, styled } from 'styled-system/jsx';
import { Button, Spacing, Text } from '@/ui-lib';
import { useCart } from '@/providers/cart-provider';
import { useCurrency } from '@/providers/currency-provider';
import { formatPriceByCurrency } from '@/format/number';

import { postPurchase } from '@/remotes/purchase';
import { uniq } from 'es-toolkit';
import { getCartCount } from '@/utils/cart';
import { toast } from '@/ui-lib/components/toast';
import { useMutation } from '@tanstack/react-query';
import { getMeQueryOptions } from '@/remotes/queries/me';

interface CheckoutSectionProps {
  totalPrice: number;
  deliveryFee: number;
  deliveryMethod: 'EXPRESS' | 'PREMIUM';
}

function CheckoutSection({ totalPrice, deliveryMethod, deliveryFee }: CheckoutSectionProps) {
  const { carts } = useCart();
  const { currency, exchangeRate } = useCurrency();
  const navigate = useNavigate();
  const { isPending, mutate } = useMutation({
    mutationFn: postPurchase,
    async onSuccess(_data, _variables, _onMutateResult, context) {
      await context.client.invalidateQueries({ queryKey: [getMeQueryOptions().queryKey] });
      toast.success('결제가 완료되었습니다.');
      navigate('/');
    },
  });

  const handleTransaction = () => {
    mutate({
      deliveryType: deliveryMethod,
      totalPrice: totalPrice + deliveryFee,
      // FIXME: 시간복잡도 높음. 오래걸리면 최적화 해아함
      items: uniq(carts).map(cart => {
        return {
          productId: cart.id,
          quantity: getCartCount(cart.id, carts),
        };
      }),
    });
  };

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
              <Text variant="B2_Regular">주문금액({carts.length}개)</Text>
              <Text variant="B2_Bold" color="state.green">
                무료배송
              </Text>
            </Flex>
            <Spacing size={3} />
            <Flex justify="space-between">
              <Text variant="B2_Regular">배송비</Text>
              <Text variant="B2_Bold">무료</Text>
            </Flex>
          </Box>

          <Divider color="border.01_gray" />

          <HStack justify="space-between">
            <Text variant="H2_Bold">총 금액</Text>
            <Text variant="H2_Bold">{formatPriceByCurrency(totalPrice * exchangeRate[currency], currency)}</Text>
          </HStack>
        </Stack>

        <Button fullWidth size="lg" loading={isPending} onClick={handleTransaction}>
          {isPending ? '결제 중...' : '결제 진행'}
        </Button>

        <Text variant="C2_Regular" color="neutral.03_gray">
          {`우리는 신용카드, 은행 송금, 모바일 결제, 현금을 받아들입니다\n안전한 체크아웃\n귀하의 결제 정보는 암호화되어 안전합니다.`}
        </Text>
      </Stack>
    </styled.section>
  );
}

export default CheckoutSection;
