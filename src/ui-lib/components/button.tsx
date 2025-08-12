import { ark } from '@ark-ui/react';
import { forwardRef } from 'react';
import { cva, type RecipeVariantProps } from 'styled-system/css';
import { styled, type HTMLStyledProps } from 'styled-system/jsx';

export type ButtonVariantProps = RecipeVariantProps<typeof buttonRecipe>;

export const buttonRecipe = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    textDecoration: 'none',
    transition: 'all 0.2s ease-in-out',
    pos: 'relative',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    w: 'fit-content',

    _active: {
      transform: 'scale(0.99)',
    },

    _disabled: {
      cursor: 'not-allowed',
      opacity: 0.6,
      pointerEvents: 'none',
    },

    _focusVisible: {
      outline: '2px solid',
      outlineColor: '01_primary',
      outlineOffset: '2px',
    },

    _loading: {
      cursor: 'wait',
      pointerEvents: 'none',
    },
  },

  variants: {
    color: {
      primary: {
        bgColor: 'primary.01_primary',
        color: 'neutral.01_black',
        _active: {
          bgColor: 'secondary.02_orange',
        },
        _disabled: {
          color: 'neutral.03_gray',
          bgColor: 'neutral.04_gray',
        },
      },

      neutral: {
        bgColor: 'background.02_light-gray',
        color: 'neutral.01_black',

        _active: {
          bgColor: 'background.03_gray',
        },
        _disabled: {
          color: 'neutral.03_gray',
          bgColor: 'neutral.04_gray',
        },
      },
    },

    size: {
      sm: {
        h: 6,
        px: 2,
        py: 1,
        textStyle: 'C1_Medium',
        rounded: 'lg',
        gap: 1.5,
      },
      md: {
        h: 9,
        px: 5,
        py: '9px',
        textStyle: 'C1_Bold',
        rounded: 'xl',
        gap: 2,
      },
      lg: {
        h: 12,
        px: 7,
        py: 3,
        textStyle: 'B1_Bold',
        gap: 2,
        rounded: '2xl',
      },
    },

    fullWidth: {
      true: {
        w: 'full',
      },
    },

    loading: {
      true: {
        cursor: 'wait',
        pointerEvents: 'none',
      },
    },
  },

  defaultVariants: {
    color: 'primary',
    size: 'md',
    fullWidth: false,
    loading: false,
  },
});

// Loading Spinner Component
const LoadingSpinner = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      animation: 'spin 1s linear infinite',
    }}
  >
    <style>
      {`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}
    </style>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray="32"
      strokeDashoffset="32"
      style={{
        animation: 'spin 1s linear infinite',
        opacity: 0.25,
      }}
    />
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

type BaseButtonProps = ButtonVariantProps & {
  /**
   * 버튼의 로딩 상태
   */
  loading?: boolean;
  /**
   * 로딩 상태일 때 표시할 텍스트
   */
  loadingText?: string;
  /**
   * 버튼 앞에 표시할 아이콘
   */
  leftIcon?: React.ReactNode;
  /**
   * 버튼 뒤에 표시할 아이콘
   */
  rightIcon?: React.ReactNode;
};

export type ButtonProps = BaseButtonProps & HTMLStyledProps<'button'>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    children,
    color = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    disabled,
    ...rest
  } = props;

  const ButtonComponent = styled(ark.button, buttonRecipe);

  const spinnerSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  }[size];

  const isDisabled = disabled || loading;

  return (
    <ButtonComponent
      ref={ref}
      color={color}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      disabled={isDisabled}
      {...rest}
    >
      {loading && <LoadingSpinner size={spinnerSize} />}
      {!loading && leftIcon && leftIcon}
      {loading ? loadingText || children : children}
      {!loading && rightIcon && rightIcon}
    </ButtonComponent>
  );
});

Button.displayName = 'Button';

export default Button;
