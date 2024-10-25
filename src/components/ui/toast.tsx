// src/components/ui/toast.tsx
import * as React from "react";
import { createPortal } from "react-dom";
import { Alert, Button } from "@/components/ui";
import { X } from "lucide-react";
import { useToast, type Toast as ToastType } from "@/hooks/ui/useToast";

interface ToastProps extends ToastType {
  onClose: () => void;
}

export function Toast({ title, description, variant = "default", action, onClose }: ToastProps) {
  return (
    <Alert 
      variant={variant} 
      className="relative transition-all duration-300 animate-slide-in"
    >
      <div className="grid gap-1">
        {title && (
          <div className="text-sm font-semibold">
            {title}
          </div>
        )}
        {description && (
          <div className="text-sm opacity-90">
            {description}
          </div>
        )}
      </div>
      {action}
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-1 top-1 rounded-full opacity-70 hover:opacity-100"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}

interface ToasterProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export function Toaster({ position = "top-right" }: ToasterProps) {
  const positionClasses = {
    "top-right": "top-0 right-0",
    "top-left": "top-0 left-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0",
  };

  const { toasts, dismiss } = useToast();

  // Only create portal on client side
  if (typeof window === "undefined") return null;

  return createPortal(
    <div
      className={`fixed z-50 flex flex-col gap-2 w-full max-w-md p-4 ${positionClasses[position]}`}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => dismiss(toast.id)} />
      ))}
    </div>,
    document.body
  );
}