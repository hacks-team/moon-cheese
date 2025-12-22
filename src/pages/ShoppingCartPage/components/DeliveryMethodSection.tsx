import { useCurrencyContext } from '@/providers/CurrencyProvider';
import { Button, Spacing, Text } from '@/ui-lib';
import { DeliveryIcon, RocketIcon } from '@/ui-lib/components/icons';
import { formatPrice } from '@/utils/currency';
import { Flex, Stack, styled } from 'styled-system/jsx';
import type { DeliveryType } from '../index';
import { useDeliveryPricing } from '../providers/DeliveryPricingProvider';

interface DeliveryMethodSectionProps {
  selectedDeliveryType: DeliveryType;
  onDeliveryChange: (type: DeliveryType) => void;
}

function DeliveryMethodSection({ selectedDeliveryType, onDeliveryChange }: DeliveryMethodSectionProps) {
  const [currency] = useCurrencyContext();
  const { expressPrice, premiumPrice, exchangeRate } = useDeliveryPricing();

  const displayExpressPrice = expressPrice === 0 ? '무료' : formatPrice(expressPrice, currency, exchangeRate);
  const displayPremiumPrice = premiumPrice === 0 ? '무료' : formatPrice(premiumPrice, currency, exchangeRate);

  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Text variant="H2_Bold">배송 방식</Text>

      <Spacing size={4} />

      <Stack gap={4}>
        <DeliveryItem
          title="Express"
          description="3-5일 후 도착 예정"
          icon={<DeliveryIcon size={28} />}
          displayPrice={displayExpressPrice}
          isSelected={selectedDeliveryType === 'EXPRESS'}
          onClick={() => onDeliveryChange('EXPRESS')}
        />
        <DeliveryItem
          title="Premium"
          description="당일 배송"
          icon={<RocketIcon size={28} />}
          displayPrice={displayPremiumPrice}
          isSelected={selectedDeliveryType === 'PREMIUM'}
          onClick={() => onDeliveryChange('PREMIUM')}
        />
      </Stack>
    </styled.section>
  );
}

interface DeliveryItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  displayPrice: string;
  isSelected: boolean;
  onClick: () => void;
}

function DeliveryItem({ title, description, icon, displayPrice, isSelected, onClick }: DeliveryItemProps) {
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
        {displayPrice}
      </Text>
    </Flex>
  );
}

function DeliveryMethodSectionSkeleton() {
  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Text variant="H2_Bold">배송 방식</Text>
      <Spacing size={4} />
      <Stack gap={4}>
        {[1, 2].map(i => (
          <Flex
            key={i}
            gap={3}
            css={{
              alignItems: 'center',
              p: 5,
              py: 4,
              bgColor: 'background.02_light-gray',
              rounded: '2xl',
            }}
          >
            <styled.div css={{ w: '28px', h: '28px', bg: 'neutral.04_gray', rounded: 'md', animation: 'pulse' }} />
            <Flex flexDir="column" gap={1} flex={1}>
              <styled.div css={{ w: '80px', h: '16px', bg: 'neutral.04_gray', rounded: 'md', animation: 'pulse' }} />
              <styled.div css={{ w: '120px', h: '14px', bg: 'neutral.04_gray', rounded: 'md', animation: 'pulse' }} />
            </Flex>
            <styled.div css={{ w: '40px', h: '16px', bg: 'neutral.04_gray', rounded: 'md', animation: 'pulse' }} />
          </Flex>
        ))}
      </Stack>
    </styled.section>
  );
}

function DeliveryMethodSectionError({ resetErrorBoundary }: { resetErrorBoundary: () => void }) {
  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Text variant="H2_Bold">배송 방식</Text>
      <Spacing size={4} />
      <Stack
        gap={4}
        css={{
          p: 10,
          textAlign: 'center',
        }}
      >
        <Text variant="B2_Bold">배송 정보를 불러오는데 실패했습니다</Text>
        <Button onClick={resetErrorBoundary}>다시 시도</Button>
      </Stack>
    </styled.section>
  );
}

DeliveryMethodSection.Skeleton = DeliveryMethodSectionSkeleton;
DeliveryMethodSection.Error = DeliveryMethodSectionError;

export default DeliveryMethodSection;
