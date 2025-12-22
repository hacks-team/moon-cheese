import { Flex, Stack, styled } from 'styled-system/jsx';
import { Spacing, Text } from '@/ui-lib';
import { DeliveryIcon, RocketIcon } from '@/ui-lib/components/icons';

interface DeliveryMethodSectionProps {
  deliveryFee: number;
  value?: 'EXPRESS' | 'PREMIUM';
  onSelect?: (value: 'EXPRESS' | 'PREMIUM') => void;
}

function DeliveryMethodSection({ value, onSelect, deliveryFee }: DeliveryMethodSectionProps) {
  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Text variant="H2_Bold">배송 방식</Text>

      <Spacing size={4} />

      <Stack gap={4}>
        <DeliveryItem
          title="Express"
          description="3-5일 후 도착 예정"
          icon={<DeliveryIcon size={28} />}
          price={0}
          isSelected={value === 'EXPRESS'}
          onClick={() => onSelect?.('EXPRESS')}
        />
        <DeliveryItem
          title="Premium"
          description="당일 배송"
          icon={<RocketIcon size={28} />}
          price={deliveryFee}
          isSelected={value === 'PREMIUM'}
          onClick={() => onSelect?.('PREMIUM')}
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
  isSelected,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  price: number;
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
        {price ? `$${price}` : '무료'}
      </Text>
    </Flex>
  );
}

export default DeliveryMethodSection;
