import React, { createContext, useState, useCallback, useRef, useContext, ReactNode } from 'react';
import Toast, { ToastType } from '../components/Toast'; // Import the Toast component

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  showSuccessToast: (message: string, duration?: number) => void;
  showErrorToast: (message: string, duration?: number) => void;
  showInfoToast: (message: string, duration?: number) => void;
  showWarningToast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 5000) => {
const id = (nextId.current++).toString();
setToasts((prevToasts) => [
  ...prevToasts,
  { id, message, type, duration },
]);
  }, []);

  const removeToast = useCallback((id: string) => {
setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const showSuccessToast = useCallback((message: string, duration?: number) => {
showToast(message, 'success', duration);
  }, [showToast]);

  const showErrorToast = useCallback((message: string, duration?: number) => {
showToast(message, 'error', duration);
  }, [showToast]);

  const showInfoToast = useCallback((message: string, duration?: number) => {
showToast(message, 'info', duration);
  }, [showToast]);

  const showWarningToast = useCallback((message: string, duration?: number) => {
showToast(message, 'warning', duration);
  }, [showToast]);

  const contextValue = React.useMemo(() => ({
showToast,
showSuccessToast,
showErrorToast,
showInfoToast,
showWarningToast,
  }), [showToast, showSuccessToast, showErrorToast, showInfoToast, showWarningToast]);

  return (
<ToastContext.Provider value={contextValue}>
  {children}
  {/* ToastContainer logic is embedded here */}
  <div className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 z-50">
    <div className="flex flex-col items-end w-full space-y-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onDismiss={removeToast}
        />
      ))}
    </div>
  </div>
</ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}