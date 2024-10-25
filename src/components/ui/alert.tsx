// src/components/ui/alert.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const alertVariants = cva(
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-white border-neutral-200 text-neutral-950",
        success: "bg-success-50 border-success-200 text-success-900",
        warning: "bg-warning-50 border-warning-200 text-warning-900",
        danger: "bg-danger-50 border-danger-200 text-danger-900",
        info: "bg-info-50 border-info-200 text-info-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const icons = {
  default: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  danger: AlertCircle,
  info: Info,
};

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  icon?: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", title, children, icon = true, ...props }, ref) => {
    const Icon = icons[variant || "default"];

    return (
      <div
        ref={ref}
        role="alert"
        className={alertVariants({ variant, className })}
        {...props}
      >
        {icon && (
          <div className="absolute left-4 top-4">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className={`${icon ? 'pl-7' : ''}`}>
          {title && (
            <h5 className="mb-1 font-medium leading-none tracking-tight">
              {title}
            </h5>
          )}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    );
  }
);

Alert.displayName = "Alert";

export default Alert;