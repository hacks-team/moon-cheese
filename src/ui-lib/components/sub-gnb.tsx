import { Tabs, tabsAnatomy } from '@ark-ui/react';
import { forwardRef, type ReactNode } from 'react';
import { cx, sva, type RecipeVariantProps } from 'styled-system/css';

export type SubGNBVariantProps = RecipeVariantProps<typeof subGNBRecipe>;

export const subGNBRecipe = sva({
  slots: tabsAnatomy.keys(),
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: 'full',
    },
    list: {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      px: 5,
      py: 2.5,
    },
    trigger: {
      rounded: 'full',
      px: 3,
      py: '9px',
      minW: '47px',
      textStyle: 'C1_Bold',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: 'none',
      background: 'none',
      outline: 'none',

      _hover: {
        transform: 'scale(0.95)',
      },

      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'primary.01_primary',
        outlineOffset: '1px',
      },
    },
  },
  variants: {
    variant: {
      default: {
        trigger: {
          color: 'neutral.01_black',
          bgColor: 'background.03_gray',

          _selected: {
            color: 'neutral.05_white',
            bgColor: 'neutral.01_black',
          },
        },
      },
      outline: {
        trigger: {
          color: 'neutral.01_black',
          border: '1px solid',
          borderColor: 'neutral.04_gray',
          bgColor: 'transparent',

          _selected: {
            color: 'primary.01_primary',
            borderColor: 'primary.01_primary',
            bgColor: 'background.01_white',
          },
        },
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// SubGNB Root Component
export interface SubGNBRootProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (details: { value: string }) => void;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
}

const SubGNBRoot = forwardRef<HTMLDivElement, SubGNBRootProps>(
  ({ children, value, defaultValue, onValueChange, variant = 'default', className, ...props }, ref) => {
    const classes = subGNBRecipe({ variant });

    return (
      <Tabs.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        className={cx(classes.root, className)}
        ref={ref}
        {...props}
      >
        {children}
      </Tabs.Root>
    );
  }
);

SubGNBRoot.displayName = 'SubGNBRoot';

// SubGNB List Component
export interface SubGNBListProps {
  children: ReactNode;
  className?: string;
}

const SubGNBList = forwardRef<HTMLDivElement, SubGNBListProps>(({ children, className, ...props }, ref) => {
  const classes = subGNBRecipe();

  return (
    <Tabs.List ref={ref} className={cx(classes.list, className)} {...props}>
      {children}
    </Tabs.List>
  );
});

SubGNBList.displayName = 'SubGNBList';

// SubGNB Trigger Component
export interface SubGNBTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

const SubGNBTrigger = forwardRef<HTMLButtonElement, SubGNBTriggerProps>(
  ({ value, children, className, ...props }, ref) => {
    const classes = subGNBRecipe();

    return (
      <Tabs.Trigger ref={ref} value={value} className={cx(classes.trigger, className)} {...props}>
        {children}
      </Tabs.Trigger>
    );
  }
);

SubGNBTrigger.displayName = 'SubGNBTrigger';

// Combined SubGNB Component Export
const SubGNB = {
  Root: SubGNBRoot,
  List: SubGNBList,
  Trigger: SubGNBTrigger,
};

export default SubGNB;
