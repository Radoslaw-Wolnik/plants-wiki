// src/components/ui/badge.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary-100 text-primary-800",
        secondary: "bg-secondary-100 text-secondary-800",
        success: "bg-success-100 text-success-800",
        danger: "bg-danger-100 text-danger-800",
        warning: "bg-warning-100 text-warning-800",
        outline: "text-neutral-950 border border-neutral-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={badgeVariants({ variant, className })}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export default Badge;