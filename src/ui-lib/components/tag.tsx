import { ark } from '@ark-ui/react';
import { forwardRef } from 'react';
import { cva, type RecipeVariantProps } from 'styled-system/css';
import { styled, type HTMLStyledProps } from 'styled-system/jsx';

export type TagVariantProps = RecipeVariantProps<typeof tagRecipe>;

export const tagRecipe = cva({
  base: {
    w: 'fit-content',
    px: 1,
    py: '3px',
    rounded: 'md',
    textStyle: 'C2_Medium',
  },

  variants: {
    type: {
      cheese: { color: 'secondary.02_orange', bgColor: 'background.04_yellow' },

      cracker: {
        color: 'secondary.01_brown',
        bgColor: 'background.06_brown',
      },

      tea: {
        color: 'state.green',
        bgColor: 'background.05_green',
      },
    },
  },

  defaultVariants: {
    type: 'cheese',
  },
});

export type TagProps = TagVariantProps & HTMLStyledProps<'div'>;

export type TagType = Exclude<TagProps['type'], undefined>;

const Tag = forwardRef<HTMLDivElement, TagProps>((props, ref) => {
  const { type = 'cheese', ...rest } = props;

  const TagComponent = styled(ark.div, tagRecipe);

  const label: Record<typeof type, string> = {
    cheese: 'Cheese',
    cracker: 'Cracker',
    tea: 'Tea',
  };

  return (
    <TagComponent ref={ref} type={type} {...rest}>
      {label[type]}
    </TagComponent>
  );
});

Tag.displayName = 'Tag';

export default Tag;
