import { SECOND } from '@/constants/time';
import { useCartAction, useCartValue } from '@/providers/CartProvider';
import { useCurrencyContext } from '@/providers/CurrencyProvider';
import { queries } from '@/queries';
import type { GradeShipping } from '@/queries/grade';
import { purchaseProduct } from '@/queries/product';
import { Button, Spacing, Text } from '@/ui-lib';
import { toast } from '@/ui-lib/components/toast';
import { delay } from '@/utils/async';
import { formatPrice } from '@/utils/currency';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { Box, Divider, Flex, HStack, Stack, styled } from 'styled-system/jsx';
import type { DeliveryType } from '../index';
import { useDeliveryPricing } from '../providers/DeliveryPricingProvider';
import { calculateDeliveryFee, calculateProductsTotal } from '../utils/shipping';

interface CheckoutSectionProps {
  deliveryType: DeliveryType;
}

function CheckoutSection({ deliveryType }: CheckoutSectionProps) {
  const { items } = useCartValue();
  const { data: productData } = useSuspenseQuery(queries.product.list);
  const { gradeShipping } = useDeliveryPricing();

  // 단일 관심사가 깨지지만 중복 계산을 막기 위해 부모에서 선언.. 이거 개인적으로 더 좋은 방법 찾고싶음 일단 회사에서 한대로 구현함
  // 복잡도 증가시 데이터파이프라인 레이어로 분리 필요
  const productsTotalPrice = calculateProductsTotal(items, productData.products);
  const deliveryFee = gradeShipping
    ? calculateDeliveryFee({
        deliveryType,
        baseShippingFee: gradeShipping.shippingFee,
        freeShippingThreshold: gradeShipping.freeShippingThreshold,
        productsTotalPrice,
      })
    : 0;
  const totalPrice = productsTotalPrice + deliveryFee;

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
        {/* 결제 금액 요약 */}
        <Stack gap={5}>
          <Box gap={3}>
            <OrderQuantityRow productsTotalPrice={productsTotalPrice} gradeShipping={gradeShipping} />
            <Spacing size={3} />
            <DeliveryFeeRow deliveryFee={deliveryFee} />
          </Box>
          <Divider color="border.01_gray" />
          <TotalPriceRow totalPrice={totalPrice} />
        </Stack>

        <PurchaseButton deliveryType={deliveryType} totalPrice={totalPrice} />

        <Text variant="C2_Regular" color="neutral.03_gray">
          {`우리는 신용카드, 은행 송금, 모바일 결제, 현금을 받아들입니다\n안전한 체크아웃\n귀하의 결제 정보는 암호화되어 안전합니다.`}
        </Text>
      </Stack>
    </styled.section>
  );
}

interface OrderQuantityRowProps {
  productsTotalPrice: number;
  gradeShipping: GradeShipping | undefined;
}

/** 주문금액 행 */
function OrderQuantityRow({ productsTotalPrice, gradeShipping }: OrderQuantityRowProps) {
  const { totalQuantity } = useCartValue();
  const isFreeShipping = gradeShipping ? productsTotalPrice >= gradeShipping.freeShippingThreshold : false;

  return (
    <Flex justify="space-between">
      <Text variant="B2_Regular">주문금액({totalQuantity}개)</Text>
      {isFreeShipping && (
        <Text variant="B2_Bold" color="state.green">
          무료배송
        </Text>
      )}
    </Flex>
  );
}

interface DeliveryFeeRowProps {
  deliveryFee: number;
}

/** 배송비 행 */
function DeliveryFeeRow({ deliveryFee }: DeliveryFeeRowProps) {
  const [currency] = useCurrencyContext();
  const { exchangeRate } = useDeliveryPricing();
  const displayDeliveryFee = deliveryFee === 0 ? '무료' : formatPrice(deliveryFee, currency, exchangeRate);

  return (
    <Flex justify="space-between">
      <Text variant="B2_Regular">배송비</Text>
      <Text variant="B2_Bold">{displayDeliveryFee}</Text>
    </Flex>
  );
}

interface TotalPriceRowProps {
  totalPrice: number;
}

/** 총 금액 행 */
function TotalPriceRow({ totalPrice }: TotalPriceRowProps) {
  const [currency] = useCurrencyContext();
  const { exchangeRate } = useDeliveryPricing();
  const displayTotalPrice = formatPrice(totalPrice, currency, exchangeRate);

  return (
    <HStack justify="space-between">
      <Text variant="H2_Bold">총 금액</Text>
      <Text variant="H2_Bold">{displayTotalPrice}</Text>
    </HStack>
  );
}

interface PurchaseButtonProps {
  deliveryType: DeliveryType;
  totalPrice: number;
}

/** 결제 버튼 */
function PurchaseButton({ deliveryType, totalPrice }: PurchaseButtonProps) {
  const navigate = useNavigate();
  const { items } = useCartValue();
  const { clearCart } = useCartAction();

  const purchaseMutation = useMutation({
    mutationFn: purchaseProduct,
    onSuccess: async () => {
      await delay(SECOND);
      toast.success('결제가 완료되었습니다.');
      clearCart();
      await delay(SECOND * 2);
      navigate('/');
    },
    onError: () => {
      toast.error('결제에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const onClickPurchase = () => {
    purchaseMutation.mutate({
      deliveryType,
      totalPrice,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });
  };

  return (
    <Button fullWidth size="lg" loading={purchaseMutation.isPending} onClick={onClickPurchase}>
      {purchaseMutation.isPending ? '결제 중...' : '결제 진행'}
    </Button>
  );
}

export default CheckoutSection;
