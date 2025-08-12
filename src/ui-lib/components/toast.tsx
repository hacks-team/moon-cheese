import { toastAnatomy } from '@ark-ui/react';
import { AlertTriangle, Check, X } from 'lucide-react';
import { createContext, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { sva, type RecipeVariantProps } from 'styled-system/css';
import { styled } from 'styled-system/jsx';

export type ToastVariantProps = RecipeVariantProps<typeof toastRecipe>;

export const toastRecipe = sva({
  slots: toastAnatomy.keys(),
  base: {
    root: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      p: 4,
      rounded: '2xl',
      bg: 'white',
      shadow: 'xl',

      minW: '320px',
      maxW: '400px',
      position: 'relative',
      overflow: 'hidden',
      transform: 'translateY(0) scale(1)',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      willChange: 'transform, opacity',

      _before: {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '4px',
        rounded: 'full',
      },

      '&[data-state="entering"]': {
        transform: 'translateY(100%) scale(0.95)',
        opacity: 0,
      },

      '&[data-state="open"]': {
        transform: 'translateY(0) scale(1)',
        opacity: 1,
      },

      '&[data-state="exiting"]': {
        transform: 'translateY(100%) scale(0.95)',
        opacity: 0,
      },

      // Icon styles within root
      '& .toast-icon': {
        flexShrink: 0,
        w: 6,
        h: 6,
        mt: 0.5,
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
        animation: 'fadeInScale 0.3s ease-out',
      },

      // Content wrapper styles
      '& .toast-content': {
        flex: 1,
        minW: 0,
      },

      // Hover effect
      _hover: {
        transform: 'translateY(-2px) scale(1.02)',
        shadow: '2xl',
      },
    },

    group: {
      position: 'fixed',
      bottom: 4,
      left: 0,
      right: 0,
      mx: 'auto',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      maxW: '420px',
      w: 'full',
      p: 5,
      pointerEvents: 'none',

      '& > *': {
        pointerEvents: 'auto',
      },
    },

    title: {
      textStyle: 'B1_Medium',
      color: 'neutral.01_black',
      mb: 1,
      lineHeight: 'tight',
    },

    description: {
      textStyle: 'B2_Regular',
      color: 'neutral.03_gray',
      lineHeight: 'relaxed',
    },

    closeTrigger: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      w: 8,
      h: 8,
      rounded: 'lg',
      cursor: 'pointer',
      transition: 'all 0.2s ease-out',
      color: 'neutral.02_gray',
      border: 'none',
      bg: 'rgba(0, 0, 0, 0.05)',

      _hover: {
        color: 'neutral.08_darkgray',
        bg: 'rgba(0, 0, 0, 0.1)',
        transform: 'scale(1.1)',
      },

      _active: {
        transform: 'scale(0.95)',
      },
    },
  },

  variants: {
    type: {
      success: {
        root: {
          bg: 'background.05_green',

          '& .toast-icon': {
            color: 'state.green',
          },
        },
      },
      error: {
        root: {
          bg: 'background.06_brown',

          '& .toast-icon': {
            color: 'state.red',
          },
        },
      },
    },
  },

  defaultVariants: {
    type: 'success',
  },
});

const StyledToastRoot = styled('div');
const StyledToastTitle = styled('div');
const StyledToastDescription = styled('div');
const StyledToastCloseTrigger = styled('button');
const StyledToastGroup = styled('div');

// Type icons mapping
const typeIcons = {
  success: Check,
  error: X,
  warning: AlertTriangle,
} as const;

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error';
  duration?: number;
}

interface ToastContextValue {
  create: (toast: Omit<ToastData, 'id'>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Individual Toast Component
interface ToastComponentProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const ToastComponent = ({ toast, onDismiss }: ToastComponentProps) => {
  const [state, setState] = useState<'entering' | 'open' | 'exiting'>('entering');
  const IconComponent = typeIcons[toast.type];
  const classes = toastRecipe({ type: toast.type });

  useEffect(() => {
    // Enter animation
    const enterTimer = setTimeout(() => setState('open'), 50);

    // Auto dismiss
    let dismissTimer: NodeJS.Timeout;
    if (toast.duration && toast.duration > 0) {
      dismissTimer = setTimeout(() => {
        setState('exiting');
        setTimeout(() => onDismiss(toast.id), 400);
      }, toast.duration);
    }

    return () => {
      clearTimeout(enterTimer);
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, [toast.duration, toast.id, onDismiss]);

  const handleClose = () => {
    setState('exiting');
    setTimeout(() => onDismiss(toast.id), 400);
  };

  return (
    <StyledToastRoot className={classes.root} data-state={state}>
      <div className="toast-icon">
        <IconComponent size={24} />
      </div>
      <div className="toast-content">
        <StyledToastTitle className={classes.title}>{toast.title}</StyledToastTitle>
        {toast.description && (
          <StyledToastDescription className={classes.description}>{toast.description}</StyledToastDescription>
        )}
      </div>
      <StyledToastCloseTrigger className={classes.closeTrigger} onClick={handleClose} aria-label="Close toast">
        <X size={18} />
      </StyledToastCloseTrigger>
    </StyledToastRoot>
  );
};

export interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const classes = toastRecipe();

  const create = (toast: Omit<ToastData, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastData = {
      ...toast,
      id,
      duration: toast.duration ?? (toast.type === 'error' ? 7000 : 5000),
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  };

  const dismiss = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const dismissAll = () => {
    setToasts([]);
  };

  const contextValue: ToastContextValue = {
    create,
    dismiss,
    dismissAll,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <StyledToastGroup className={classes.group}>
            {toasts.map(toast => (
              <ToastComponent key={toast.id} toast={toast} onDismiss={dismiss} />
            ))}
          </StyledToastGroup>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

// Hook for using toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Global toast context
let globalToastContext: ToastContextValue | null = null;

export const setGlobalToastContext = (context: ToastContextValue) => {
  globalToastContext = context;
};

export const toast = {
  success: (title: string, description?: string) => {
    if (!globalToastContext) {
      console.warn('Toast context not initialized. Make sure ToastProvider is mounted.');
      return '';
    }
    return globalToastContext.create({
      title,
      description,
      type: 'success',
    });
  },

  error: (title: string, description?: string) => {
    if (!globalToastContext) {
      console.warn('Toast context not initialized. Make sure ToastProvider is mounted.');
      return '';
    }
    return globalToastContext.create({
      title,
      description,
      type: 'error',
    });
  },

  dismiss: (id: string) => {
    if (!globalToastContext) {
      console.warn('Toast context not initialized. Make sure ToastProvider is mounted.');
      return;
    }
    globalToastContext.dismiss(id);
  },

  dismissAll: () => {
    if (!globalToastContext) {
      console.warn('Toast context not initialized. Make sure ToastProvider is mounted.');
      return;
    }
    globalToastContext.dismissAll();
  },
};

// Global toast context initializer component
export const ToastContextInitializer = () => {
  const toastContext = useToast();

  useEffect(() => {
    setGlobalToastContext(toastContext);
    return () => {
      setGlobalToastContext(null as any);
    };
  }, [toastContext]);

  return null;
};

// Enhanced ToastProvider with global context
export const EnhancedToastProvider = ({ children }: ToastProviderProps) => {
  return (
    <ToastProvider>
      <ToastContextInitializer />
      {children}
    </ToastProvider>
  );
};

export default ToastProvider;
