// src/components/ui/dialog.tsx
import React from 'react';
import { X } from 'lucide-react';
import Button from './button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  ({ isOpen, onClose, title, children, className = "" }, ref) => {
    if (!isOpen) return null;

    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };

      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }, [onClose]);

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 text-center">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
          <div
            ref={ref}
            className={`
              inline-block w-full max-w-md p-6 my-8 text-left align-middle 
              bg-white rounded-lg shadow-xl transform transition-all
              ${className}
            `}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-4">
              {title && (
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {title}
                </h3>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute right-4 top-4"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {children}
          </div>
        </div>
      </div>
    );
  }
);

Dialog.displayName = "Dialog";

export default Dialog;