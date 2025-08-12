import { Spacing, Text } from '@/ui-lib';
import { styled } from 'styled-system/jsx';

type ProductDetailSectionProps = {
  description: string;
};

function ProductDetailSection({ description }: ProductDetailSectionProps) {
  return (
    <styled.section css={{ bg: 'background.01_white', px: 5, pt: 5, pb: 6 }}>
      <Text variant="H2_Bold">상세 정보</Text>

      <Spacing size={4} />

      <Text variant="B2_Regular" color="neutral.02_gray">
        {description}
      </Text>
    </styled.section>
  );
}

export default ProductDetailSection;
