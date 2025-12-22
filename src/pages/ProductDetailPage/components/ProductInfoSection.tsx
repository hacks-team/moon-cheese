import { CATEGORY_TO_TAG_TYPE } from '@/constants/product';
import { useCurrencyContext } from '@/providers/CurrencyProvider';
import { queries } from '@/queries';
import type { ProductCategory } from '@/types/product';
import { RatingGroup, Spacing, Text } from '@/ui-lib';
import Tag from '@/ui-lib/components/tag';
import { formatPrice } from '@/utils/currency';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Box, Stack, styled } from 'styled-system/jsx';

type ProductInfoSectionProps = {
  name: string;
  category: ProductCategory;
  rating: number;
  price: number;
};

function ProductInfoSection({ name, category, rating, price }: ProductInfoSectionProps) {
  const [currency] = useCurrencyContext();
  const { data: exchangeRateData } = useSuspenseQuery(queries.exchangeRate.current);

  const tagType = CATEGORY_TO_TAG_TYPE[category];
  const formattedPrice = formatPrice(price, currency, exchangeRateData.exchangeRate);

  return (
    <styled.section css={{ bg: 'background.01_white', p: 5 }}>
      <Box>
        <Stack gap={2}>
          <Tag type={tagType} />
          <Text variant="B1_Bold">{name}</Text>
          <RatingGroup value={rating} readOnly label={`${rating.toFixed(1)}`} />
        </Stack>
        <Spacing size={4} />
        <Text variant="H1_Bold">{formattedPrice}</Text>
      </Box>
    </styled.section>
  );
}

export default ProductInfoSection;
