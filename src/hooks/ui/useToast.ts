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

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(memoryToasts);

  useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  function addToast(toast: Omit<Toast, "id">) {
    const id = generateId();
    const duration = toast.duration ?? DEFAULT_DURATION;

    const newToast = {
      ...toast,
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

  return {
    toasts,
    toast: addToast,
    dismiss,
    dismissAll,
  };
}