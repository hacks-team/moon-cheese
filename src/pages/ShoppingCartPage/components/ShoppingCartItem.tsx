import { Tag, Text, XIcon, type TagType, type TextProps } from '@/ui-lib';
import { Center, Flex, styled, type FlexProps } from 'styled-system/jsx';

const ShoppingCartItemRoot = ({ children, ...props }: FlexProps) => {
  return (
    <Flex gap={4} {...props}>
      {children}
    </Flex>
  );
};

const ShoppingCartItemImage = ({ src, alt }: { src: string; alt: string }) => {
  return <styled.img src={src} alt={alt} css={{ w: '60px', h: '60px', rounded: 'lg' }} />;
};

const ShoppingCartItemContent = ({ children, ...props }: FlexProps) => {
  return (
    <Flex flexDir="column" gap={2} flex={1} {...props}>
      {children}
    </Flex>
  );
};

const ShoppingCartItemInfo = ({
  type,
  title,
  description,
  onDelete,
}: {
  type: TagType;
  title: string;
  description: string;
  onDelete?: () => void;
}) => {
  return (
    <Flex flexDir="column" gap={1}>
      <Flex alignItems="center" justify="space-between">
        <Tag type={type} />
        <Center onClick={onDelete} color="neutral.03_gray" cursor="pointer">
          <XIcon size={16} />
        </Center>
      </Flex>
      <Text variant="B2_Bold">{title}</Text>
      <Text variant="C1_Medium" color="neutral.02_gray">
        {description}
      </Text>
    </Flex>
  );
};

const ShoppingCartItemPrice = ({ children, ...props }: TextProps) => {
  return (
    <Text variant="H1_Bold" {...props}>
      {children}
    </Text>
  );
};
const ShoppingCartItemFooter = ({ children, ...props }: FlexProps) => {
  return (
    <Flex alignItems="center" justify="space-between" {...props}>
      {children}
    </Flex>
  );
};

// Compound component pattern
const ShoppingCartItem = {
  Root: ShoppingCartItemRoot,
  Image: ShoppingCartItemImage,
  Content: ShoppingCartItemContent,
  Info: ShoppingCartItemInfo,
  Price: ShoppingCartItemPrice,
  Footer: ShoppingCartItemFooter,
};

export default ShoppingCartItem;
