import { RatingGroup as ArkRatingGroup, ratingGroupAnatomy } from '@ark-ui/react';
import { forwardRef } from 'react';
import { sva, type RecipeVariantProps } from 'styled-system/css';
import { styled, type HTMLStyledProps } from 'styled-system/jsx';
import Text from './text';

export type RatingGroupVariantProps = RecipeVariantProps<typeof ratingGroupRecipe>;

export const ratingGroupRecipe = sva({
  slots: ratingGroupAnatomy.keys(),
  base: {
    root: {
      display: 'flex',
      flexDir: 'row',
      alignItems: 'center',
      gap: 1,
    },
    label: {
      color: 'neutral.01_black',
      fontWeight: 'medium',
      fontSize: '14px',
    },
    control: {
      display: 'flex',
      alignItems: 'center',
    },
    item: {
      cursor: 'pointer',
      transitionDuration: 'normal',
      transitionProperty: 'color, fill',
      transitionTimingFunction: 'default',

      color: 'neutral.04_gray',
      _highlighted: {
        color: 'state.red',
      },

      _hover: {
        fill: 'state.red',
        color: 'state.red',
      },
    },
  },
  variants: {
    size: {
      md: {
        control: {
          gap: '0',
        },
        item: {
          width: '16px',
          height: '16px',
          '& svg': {
            width: '16px',
            height: '16px',
          },
        },
        label: {
          fontSize: '12px',
        },
      },
      lg: {
        control: {
          gap: '2px',
        },
        item: {
          width: '20px',
          height: '20px',
          '& svg': {
            width: '20px',
            height: '20px',
          },
        },
        label: {
          fontSize: '14px',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// Star Icon Component
const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={'currentColor'}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

export type RatingGroupProps = RatingGroupVariantProps &
  HTMLStyledProps<'div'> & {
    value?: number;
    defaultValue?: number;
    onValueChange?: (details: { value: number }) => void;
    count?: number;

    readOnly?: boolean;
    disabled?: boolean;
    label?: string;
    icon?: React.ComponentType<{ filled?: boolean }>;
  };

const RatingGroup = forwardRef<HTMLDivElement, RatingGroupProps>((props, ref) => {
  const {
    value,
    defaultValue = 0,
    onValueChange,
    count = 5,
    readOnly = false,
    disabled = false,
    label,
    icon: CustomIcon = StarIcon,
    size = 'md',
    ...rest
  } = props;

  const classes = ratingGroupRecipe({ size });
  const Container = styled('div');

  return (
    <Container ref={ref} className={classes.root} {...rest}>
      <ArkRatingGroup.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        count={count}
        readOnly={readOnly}
        disabled={disabled}
      >
        <ArkRatingGroup.Control className={classes.control}>
          <ArkRatingGroup.Context>
            {({ items }) =>
              items.map(item => (
                <ArkRatingGroup.Item key={item} index={item} className={classes.item}>
                  <ArkRatingGroup.ItemContext>
                    {({ highlighted }) => <CustomIcon filled={highlighted} />}
                  </ArkRatingGroup.ItemContext>
                </ArkRatingGroup.Item>
              ))
            }
          </ArkRatingGroup.Context>
        </ArkRatingGroup.Control>

        <ArkRatingGroup.HiddenInput />
      </ArkRatingGroup.Root>
      {label && (
        <Text variant="C1_Medium" color="neutral.02_gray" className={classes.label}>
          {label}
        </Text>
      )}
    </Container>
  );
});

RatingGroup.displayName = 'RatingGroup';

export default RatingGroup;
