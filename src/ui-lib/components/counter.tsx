import type React from 'react';
import { styled } from 'styled-system/jsx';
import { MinusIcon, PlusIcon } from './icons';

const StyledCounterContainer = styled('div', {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid',
    borderColor: 'border.01_gray',
    rounded: 'full',
    p: 1,
    gap: 1,
    userSelect: 'none',
    h: '28px',
    w: '89px',
  },
});

const StyledCounterButton = styled('button', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bg: 'transparent',
    border: 'none',
    rounded: '50%',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    fontWeight: 'bold',
    color: 'neutral.01_black',
    w: '24px',
    h: '24px',
    fontSize: '14px',

    _hover: {
      bgColor: 'neutral.04_lightestgray',
      transform: 'scale(1.1)',
    },

    _active: {
      transform: 'scale(0.95)',
    },

    _disabled: {
      cursor: 'not-allowed',
      color: 'neutral.04_gray',
      pointerEvents: 'none',
    },
  },
});

const StyledCounterDisplay = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'semibold',
    color: 'neutral.09_black',
    minW: '20px',
  },
});

interface CounterRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CounterRoot = ({ children, onClick, ...props }: CounterRootProps) => {
  return (
    <StyledCounterContainer
      {...props}
      onClick={e => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      {children}
    </StyledCounterContainer>
  );
};

interface CounterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const CounterMinus = ({ children, ...props }: CounterButtonProps) => {
  return (
    <StyledCounterButton aria-label="Decrease value" {...props}>
      {children || <MinusIcon />}
    </StyledCounterButton>
  );
};

interface CounterDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: React.ReactNode;
  children?: React.ReactNode;
}

const CounterDisplay = ({ children, value, ...props }: CounterDisplayProps) => {
  return <StyledCounterDisplay {...props}>{children !== undefined ? children : value}</StyledCounterDisplay>;
};

const CounterPlus = ({ children, ...props }: CounterButtonProps) => {
  return (
    <StyledCounterButton aria-label="Increase value" {...props}>
      {children || <PlusIcon />}
    </StyledCounterButton>
  );
};

// Compound component pattern
const Counter = {
  Root: CounterRoot,
  Minus: CounterMinus,
  Display: CounterDisplay,
  Plus: CounterPlus,
};

export default Counter;
