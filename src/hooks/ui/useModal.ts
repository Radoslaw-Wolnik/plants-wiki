// src/hooks/ui/useModal.ts
import { useState, useCallback } from 'react';

export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState<any>(null);

  const open = useCallback((modalData?: any) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    toggle
  };
}