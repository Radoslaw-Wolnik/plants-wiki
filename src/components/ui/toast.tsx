// src/components/ui/toast.tsx
import * as React from "react";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Alert } from "./alert";
import { Button } from "./button";
import { createPortal } from "react-dom";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  variant?: "default" | "destructive" | "success";
  onClose?: () => void;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

const ToastContext = React.createContext<{
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}>({
  addToast: () => {},
  removeToast: () => {},
});

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [...prevToasts, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {typeof window !== "undefined" &&
        createPortal(
          <div className="fixed top-0 right-0 z-50 p-4 space-y-4 max-w-sm w-full">
            {toasts.map((toast) => (
              <ToastItem key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<Toast> = ({
  title,
  description,
  variant = "default",
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <Alert
      variant={variant}
      className="relative transform transition-all duration-300 ease-in-out"
    >
      {title && <Alert.Title>{title}</Alert.Title>}
      {description && <Alert.Description>{description}</Alert.Description>}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
};

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return {
    toast: (props: Omit<Toast, "id">) => context.addToast(props),
    dismiss: (id: string) => context.removeToast(id),
  };
}
