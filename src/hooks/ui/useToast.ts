// src/hooks/ui/useToast.ts
import { useState, useEffect } from "react";

export type ToastVariant = "default" | "success" | "warning" | "danger" | "info";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  variant?: ToastVariant;
  action?: React.ReactNode;
}

export interface ToastOptions extends Omit<Toast, 'id'> {
  duration?: number;
  action?: React.ReactNode;
}

const TOAST_LIMIT = 5;
const DEFAULT_DURATION = 5000;

let count = 0;
function generateId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ToastListener = (toasts: Toast[]) => void;
const listeners = new Set<ToastListener>();
let memoryToasts: Toast[] = [];

function dispatch(toasts: Toast[]) {
  memoryToasts = toasts;
  listeners.forEach((listener) => listener(toasts));
}

export interface ToastAPI {
  toasts: Toast[];
  toast: (options: ToastOptions) => string;
  success: (message: string, options?: Partial<ToastOptions>) => string;
  error: (message: string, options?: Partial<ToastOptions>) => string;
  warning: (message: string, options?: Partial<ToastOptions>) => string;
  info: (message: string, options?: Partial<ToastOptions>) => string;
  dismiss: (toastId: string) => void;
  dismissAll: () => void;
}

export function useToast(): ToastAPI {
  const [toasts, setToasts] = useState<Toast[]>(memoryToasts);

  useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  function addToast(options: ToastOptions) {
    const id = generateId();
    const duration = options.duration ?? DEFAULT_DURATION;
    
    const newToast = {
      ...options,
      id,
      duration,
    };

    dispatch([...memoryToasts, newToast].slice(-TOAST_LIMIT));

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }

    return id;
  }

  function dismiss(toastId: string) {
    dispatch(memoryToasts.filter((toast) => toast.id !== toastId));
  }

  function dismissAll() {
    dispatch([]);
  }

  const success = (message: string, options: Partial<ToastOptions> = {}) => 
    addToast({
      title: "Success",
      description: message,
      variant: "success",
      ...options,
    });

  const error = (message: string, options: Partial<ToastOptions> = {}) => 
    addToast({
      title: "Error",
      description: message,
      variant: "danger",
      ...options,
    });

  const warning = (message: string, options: Partial<ToastOptions> = {}) => 
    addToast({
      title: "Warning",
      description: message,
      variant: "warning",
      ...options,
    });

  const info = (message: string, options: Partial<ToastOptions> = {}) => 
    addToast({
      title: "Info",
      description: message,
      variant: "info",
      ...options,
    });

  return {
    toasts,
    toast: addToast,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
  };
}