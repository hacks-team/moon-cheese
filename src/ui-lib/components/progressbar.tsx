import { Progress as ArkProgress, ark, progressAnatomy } from '@ark-ui/react';
import { forwardRef } from 'react';
import { type RecipeVariantProps, sva } from 'styled-system/css';
import { type HTMLStyledProps, styled } from 'styled-system/jsx';

export type ProgressBarVariantProps = RecipeVariantProps<typeof progressBarRecipe>;

export const progressBarRecipe = sva({
  slots: progressAnatomy.keys(),
  base: {
    root: {
      display: 'flex',
      flexDir: 'column',
      gap: 2,
    },
    label: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 14,
      fontWeight: 'medium',
      color: 'neutral.02_gray',
    },
    track: {
      w: 'full',
      bg: 'neutral.04_gray',
      rounded: 'full',
      overflow: 'hidden',
      pos: 'relative',
    },
    range: {
      h: 'full',
      rounded: 'full',
      transition: 'width 0.3s ease-in-out',
      pos: 'relative',
      overflow: 'hidden',
    },
  },
  variants: {
    size: {
      xs: {
        track: { height: 1 },
      },
      sm: {
        track: { height: 2 },
      },
      md: {
        track: { height: 3 },
      },
      lg: {
        track: { height: 4 },
      },
      xl: {
        track: { height: 5 },
      },
    },
    color: {
      primary: {
        range: {
          backgroundColor: 'primary.01_primary',
        },
      },
    },
    animated: {
      true: {
        range: {
          '&::after': {
            content: '""',
            pos: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            bg: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            animation: 'shimmer 2s infinite',
          },
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
    animated: false,
  },
});

export type ProgressBarProps = HTMLStyledProps<'div'> &
  ProgressBarVariantProps & {
    /**
     * 0 ~ 1 사이의 값
     */
    value: number;
    showLabel?: boolean;
    label?: string;
  };

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>((props, ref) => {
  const { value, size = 'md', color = 'primary', animated = false, showLabel = false, label, ...rest } = props;

  const percentage = Math.min(Math.max(value * 100, 0), 100);
  const classes = progressBarRecipe({ size, color, animated });

  const Container = styled(ark.div);

  return (
    <Container ref={ref} className={classes.root} {...rest}>
      {(showLabel || label) && (
        <div className={classes.label}>
          {label && <span>{label}</span>}
          {showLabel && <span>{Math.round(percentage)}%</span>}
        </div>
      )}

      <ArkProgress.Root value={value * 100} data-testid="progress-bar">
        <ArkProgress.Track className={classes.track}>
          <ArkProgress.Range className={classes.range} />
        </ArkProgress.Track>
      </ArkProgress.Root>
    </Container>
  );
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
