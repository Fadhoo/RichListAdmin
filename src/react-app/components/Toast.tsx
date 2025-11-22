import { JSX, useEffect, useState } from 'react';
import {
  X, CheckCircle, AlertCircle, Info, TriangleAlert as Warning
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onDismiss: (id: string) => void;
  duration?: number; // Duration in milliseconds
}

const ToastIcons: Record<ToastType, JSX.Element> = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
  warning: <Warning className="w-5 h-5 text-yellow-500" />,
};

const ToastColors: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  info: 'bg-blue-50 border-blue-200',
  warning: 'bg-yellow-50 border-yellow-200',
};

export default function Toast({ id, message, type, onDismiss, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
// Animate in
setIsVisible(true);

// Auto-dismiss after duration
const timer = setTimeout(() => {
  setIsVisible(false);
  setTimeout(() => onDismiss(id), 300); // Allow time for fade-out animation
}, duration);

return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const handleDismiss = () => {
setIsVisible(false);
setTimeout(() => onDismiss(id), 300); // Allow time for fade-out animation
  };

  return (
<div
  className={`
    w-full max-w-sm rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5
    overflow-hidden transform transition-all duration-300 ease-out
    ${ToastColors[type]} border
    ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
  `}
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
>
  <div className="p-4">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        {ToastIcons[type]}
      </div>
      <div className="ml-3 w-0 flex-1 pt-0.5">
        <p className="text-sm font-medium text-gray-900">{message}</p>
      </div>
      <div className="ml-4 flex-shrink-0 flex">
        <button
          onClick={handleDismiss}
          className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <span className="sr-only">Close</span>
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</div>
  );
}