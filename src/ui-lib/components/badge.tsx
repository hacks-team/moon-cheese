import { forwardRef, type ReactNode } from 'react';
import { cva, type RecipeVariantProps } from 'styled-system/css';
import { Circle, styled, type HTMLStyledProps } from 'styled-system/jsx';
import Text from './text';

export type BadgeVariantProps = RecipeVariantProps<typeof badgeRecipe>;

export const badgeRecipe = cva({
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  variants: {
    size: {
      sm: {
        '& [data-badge]': {
          width: '12px',
          height: '12px',
          fontSize: '8px',
        },
      },
      md: {
        '& [data-badge]': {
          width: '16px',
          height: '16px',
          fontSize: '10px',
        },
      },
      lg: {
        '& [data-badge]': {
          width: '20px',
          height: '20px',
          fontSize: '12px',
        },
      },
    },

    color: {
      orange: {
        '& [data-badge]': {
          backgroundColor: 'secondary.02_orange',
          color: 'neutral.05_white',
        },
      },
      primary: {
        '& [data-badge]': {
          backgroundColor: 'primary.01_primary',
          color: 'neutral.01_black',
        },
      },
      red: {
        '& [data-badge]': {
          backgroundColor: 'state.red',
          color: 'neutral.05_white',
        },
      },
      green: {
        '& [data-badge]': {
          backgroundColor: 'state.green',
          color: 'neutral.05_white',
        },
      },
    },

    position: {
      'top-right': {
        '& [data-badge]': {
          position: 'absolute',
          top: '-4px',
          right: '-4px',
        },
      },
      'top-left': {
        '& [data-badge]': {
          position: 'absolute',
          top: '-4px',
          left: '-4px',
        },
      },
      'bottom-right': {
        '& [data-badge]': {
          position: 'absolute',
          bottom: '-4px',
          right: '-4px',
        },
      },
      'bottom-left': {
        '& [data-badge]': {
          position: 'absolute',
          bottom: '-4px',
          left: '-4px',
        },
      },
    },
  },

  defaultVariants: {
    size: 'md',
    color: 'orange',
    position: 'top-right',
  },
});

interface BaseBadgeProps {
  /**
   * The content to display inside the badge (usually a number)
   */
  content?: ReactNode;
  /**
   * The child element to attach the badge to
   */
  children: ReactNode;
  /**
   * Whether to show the badge even when content is 0 or falsy
   */
  showZero?: boolean;
  /**
   * Size of the badge
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Color variant of the badge
   */
  color?: 'orange' | 'primary' | 'red' | 'green';
  /**
   * Position of the badge relative to its container
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export type BadgeProps = BaseBadgeProps & Omit<HTMLStyledProps<'div'>, keyof BaseBadgeProps>;

const Badge = forwardRef<HTMLDivElement, BadgeProps>((props, ref) => {
  const { content, children, size = 'md', color = 'orange', position = 'top-right', showZero = false, ...rest } = props;

  const BadgeContainer = styled('div', badgeRecipe);

  // Don't show badge if content is falsy and showZero is false
  const shouldShowBadge = showZero || (content !== undefined && content !== null && content !== 0 && content !== '');

  return (
    <BadgeContainer ref={ref} size={size} color={color} position={position} {...rest}>
      {children}
      {shouldShowBadge && (
        <Circle data-badge display="flex" alignItems="center" justifyContent="center" minW="12px" minH="12px">
          <Text fontSize="inherit" fontWeight="semibold" lineHeight="1">
            {content}
          </Text>
        </Circle>
      )}
    </BadgeContainer>
  );
});

Badge.displayName = 'Badge';

export default Badge;
