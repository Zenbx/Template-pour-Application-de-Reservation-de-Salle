// hooks/useToast.ts
import { toast } from 'react-hot-toast';

export interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export function useToast() {
  const success = (title: string, message?: string, options?: ToastOptions) => {
    const content = message ? `${title}\n${message}` : title;
    return toast.success(content, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      style: {
        background: '#10B981',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        maxWidth: '400px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10B981',
      },
    });
  };

  const error = (title: string, message?: string, options?: ToastOptions) => {
    const content = message ? `${title}\n${message}` : title;
    return toast.error(content, {
      duration: options?.duration || 5000,
      position: options?.position || 'top-right',
      style: {
        background: '#EF4444',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        maxWidth: '400px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#EF4444',
      },
    });
  };

  const warning = (title: string, message?: string, options?: ToastOptions) => {
    const content = message ? `${title}\n${message}` : title;
    return toast(content, {
      duration: options?.duration || 4500,
      position: options?.position || 'top-right',
      icon: '⚠️',
      style: {
        background: '#F59E0B',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        maxWidth: '400px',
      },
    });
  };

  const info = (title: string, message?: string, options?: ToastOptions) => {
    const content = message ? `${title}\n${message}` : title;
    return toast(content, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#3B82F6',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        maxWidth: '400px',
      },
    });
  };

  const loading = (title: string, message?: string, options?: ToastOptions) => {
    const content = message ? `${title}\n${message}` : title;
    return toast.loading(content, {
      position: options?.position || 'top-right',
      style: {
        background: '#6B7280',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        maxWidth: '400px',
      },
    });
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  const promise = <T,>(
    promise: Promise<T>,
    msgs: {
      loading: string;
      success: string;
      error: string;
    },
    options?: ToastOptions
  ) => {
    return toast.promise(
      promise,
      {
        loading: msgs.loading,
        success: msgs.success,
        error: msgs.error,
      },
      {
        position: options?.position || 'top-right',
        style: {
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
          maxWidth: '400px',
        },
        success: {
          style: {
            background: '#10B981',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10B981',
          },
        },
        error: {
          style: {
            background: '#EF4444',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#EF4444',
          },
        },
        loading: {
          style: {
            background: '#6B7280',
            color: '#fff',
          },
        },
      }
    );
  };

  return {
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
    promise,
  };
}