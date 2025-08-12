import { RatingGroup, Text, type TextProps } from '@/ui-lib';
import { Box, Flex, HStack, Stack, styled, type BoxProps, type HstackProps, type StackProps } from 'styled-system/jsx';

const ProductItemRoot = ({ children, onClick, ...props }: BoxProps) => {
  return (
    <Box role="button" onClick={onClick} cursor="pointer" {...props}>
      {children}
    </Box>
  );
};

const ProductItemImage = ({ src, alt }: { src: string; alt: string }) => {
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

const ProductItemInfo = ({ title, description }: { title: string; description: string }) => {
  return (
    <Box mt={4}>
      <Flex flexDir="column" gap={0.5}>
        <Text variant="B2_Bold">{title}</Text>
        <Text variant="C1_Medium" color="neutral.02_gray">
          {description}
        </Text>
      </Flex>
    </Box>
  );
};

const ProductItemMeta = ({ children, ...props }: HstackProps) => {
  return (
    <HStack justify="space-between" alignItems="start" mt={2} mb={3} {...props}>
      {children}
    </HStack>
  );
};

const ProductItemMetaLeft = ({ children, ...props }: StackProps) => {
  return (
    <Stack gap={2} {...props}>
      {children}
    </Stack>
  );
};

const ProductItemRating = ({ rating }: { rating: number }) => {
  return <RatingGroup label={`${rating.toFixed(1)}`} readOnly value={rating} />;
};

const ProductItemPrice = ({ children, ...props }: TextProps) => {
  return (
    <Text variant="B1_Bold" {...props}>
      {children}
    </Text>
  );
};

const ProductItemFreeTag = ({ type }: { type: 'milk' | 'caffeine' | 'gluten' }) => {
  const icons = {
    milk: { src: '/icons/no-milk.png', alt: 'no-milk' },
    caffeine: { src: '/icons/decaffeine.png', alt: 'decaffeine' },
    gluten: { src: '/icons/gluten-free.png', alt: 'gluten-free' },
  };

  const icon = icons[type];
  return <styled.img src={icon.src} alt={icon.alt} w={8} h={8} />;
};

// Compound component pattern
const ProductItem = {
  Root: ProductItemRoot,
  Image: ProductItemImage,
  Info: ProductItemInfo,
  Meta: ProductItemMeta,
  MetaLeft: ProductItemMetaLeft,
  Rating: ProductItemRating,
  Price: ProductItemPrice,
  FreeTag: ProductItemFreeTag,
};

export default ProductItem;
