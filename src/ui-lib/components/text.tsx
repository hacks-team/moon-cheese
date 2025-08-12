import { forwardRef } from 'react';
import { cva, type RecipeVariantProps } from 'styled-system/css';
import { styled, type HTMLStyledProps } from 'styled-system/jsx';

export type TextVariantProps = RecipeVariantProps<typeof textRecipe>;

export const textRecipe = cva({
  base: {
    color: 'neutral.01_black',
    display: 'block',
    whiteSpace: 'pre-wrap',
    wordBreak: 'keep-all',
    fontFamily: 'sans',
  },
  variants: {
    variant: {
      H1_Bold: { textStyle: 'H1_Bold' },
      H2_Bold: { textStyle: 'H2_Bold' },
      B1_Bold: { textStyle: 'B1_Bold' },
      B1_Medium: { textStyle: 'B1_Medium' },
      B1_Regular: { textStyle: 'B1_Regular' },
      B2_Bold: { textStyle: 'B2_Bold' },
      B2_Medium: { textStyle: 'B2_Medium' },
      B2_Regular: { textStyle: 'B2_Regular' },
      C1_Bold: { textStyle: 'C1_Bold' },
      C1_Medium: { textStyle: 'C1_Medium' },
      C2_Regular: { textStyle: 'C2_Regular' },
      C2_Medium: { textStyle: 'C2_Medium' },
    },
  },
  defaultVariants: {
    variant: 'B1_Regular',
  },
});

export type TextProps = HTMLStyledProps<'p'> & TextVariantProps;

const Text = forwardRef<HTMLParagraphElement, TextProps>((props, ref) => {
  const { variant, font, children, ...rest } = props;

  const textType = variant?.split('_')[0] || 'B1';

  const componentMap = {
    H1: styled('h1', textRecipe),
    H2: styled('h2', textRecipe),
    B1: styled('p', textRecipe),
    B2: styled('p', textRecipe),
    C1: styled('span', textRecipe),
    C2: styled('span', textRecipe),
  };
  const TextComponent = componentMap[textType as keyof typeof componentMap];

  return (
    <TextComponent ref={ref} variant={variant} font={font} {...rest}>
      {children}
    </TextComponent>
  );
});

Text.displayName = 'Text';

export default Text;
