import { RatingGroup, Text, type TextProps } from '@/ui-lib';
import { Box, Stack, styled, type BoxProps } from 'styled-system/jsx';

const RecommendationProductItemRoot = ({ children, onClick, ...props }: BoxProps) => {
  return (
    <Box role="button" onClick={onClick} css={{ flexShrink: 0, w: '140px', cursor: 'pointer' }} {...props}>
      {children}
    </Box>
  );
};

const RecommendationProductItemImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <styled.img
      src={src}
      alt={alt}
      css={{
        w: 'full',
        aspectRatio: 1,
        objectFit: 'cover',
        rounded: '2xl',
      }}
    />
  );
};

const RecommendationProductItemInfo = ({ name, rating }: { name: string; rating: number }) => {
  return (
    <Stack gap={1} mt={4}>
      <Text variant="C2_Medium" lineClamp={1}>
        {name}
      </Text>
      <RatingGroup value={rating} label={`${rating.toFixed(1)}`} readOnly />
    </Stack>
  );
};

const RecommendationProductItemPrice = ({ children, ...props }: TextProps) => {
  return (
    <Text variant="C1_Bold" mt={2} {...props}>
      {children}
    </Text>
  );
};

// Compound component pattern
const RecommendationProductItem = {
  Root: RecommendationProductItemRoot,
  Image: RecommendationProductItemImage,
  Info: RecommendationProductItemInfo,
  Price: RecommendationProductItemPrice,
};

export default RecommendationProductItem;
