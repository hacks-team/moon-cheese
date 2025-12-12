import { Spacing, Text } from '@/ui-lib';
import { styled } from 'styled-system/jsx';

type ProductDetailSectionProps = {
  description: string;
};

function ProductDetailSection({ description }: ProductDetailSectionProps) {
  // 첫 번째 "..." (큰따옴표) 쌍 뒤에만 줄바꿈 문자열 추가
  const formattedDescription = description.replace(/"([^"]*)"/, '"$1"\n');

  return (
    <styled.section css={{ bg: 'background.01_white', px: 5, pt: 5, pb: 6 }}>
      <Text variant="H2_Bold">상세 정보</Text>

      <Spacing size={4} />

      <Text variant="B2_Regular" color="neutral.02_gray" css={{ whiteSpace: 'pre-line' }}>
        {formattedDescription}
      </Text>
    </styled.section>
  );
}

export default ProductDetailSection;
