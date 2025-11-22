import { useState, useRef } from 'react';
import Toast, {ToastType } from './Toast';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

export type AddToast = (options: ToastOptions) => void;

interface ToastMessage extends ToastOptions {
  id: string;
  type: ToastType;
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(0);

  // This function is exposed via context to add new toasts
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addToast: AddToast = ({ message, type = 'info', duration }) => {
const id = (nextId.current++).toString();
setToasts((prevToasts) => [
  ...prevToasts,
  { id, message, type, duration },
]);
  };

  const removeToast = (id: string) => {
setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // We need to pass addToast and removeToast through context.
  // The actual provider will handle this, this component just renders.
  // For now, let's keep it simple and assume a context will manage `toasts` array.
  // The ToastContext.tsx will wrap this.

  // In a real application, you might use a ref here and expose addToast/removeToast
  // directly through that ref for the context to use.
  // For this example, let's assume the context manages the `toasts` state itself.

  // This `ToastContainer` should usually be rendered once at the top level
  // and manage its own state derived from the context.
  // Let's refactor this slightly to be purely a presentational component that consumes `toasts` from props.
  // This means the state management moves up to the `ToastProvider`.

  // For this code, I'll provide the context and provider structure as well.
  // This `ToastContainer` will actually be inside the `ToastProvider`.

  // ---- RETHINKING: The ToastContainer needs to manage its own toasts state ----
  // The addToast function needs to be exposed from the provider.
  // So, the ToastContainer will be the internal component that the Provider uses.
  // It should be completely self-contained for state management.
  // The `AddToast` type will be given by the context.

  // Let's proceed with the original idea where ToastContainer has its own state
  // and the context provides `addToast` which updates the ToastContainer's state.
  // This is typically done with a ref or a shared state object, or by making ToastContainer
  // part of the provider. Making it part of the provider is cleaner.

  return (
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
  );
}