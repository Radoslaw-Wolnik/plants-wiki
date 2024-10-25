// ToolbarButton.tsx
import React from 'react';
import { Tooltip, Button } from '@/components/ui';

interface ToolbarButtonProps {
  tooltip: string;
  onClick: () => void;
  icon: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({ tooltip, onClick, icon, active, disabled }) => (
  <Tooltip content={tooltip}>
    <Button onClick={onClick} variant={active ? 'default' : 'outline'} disabled={disabled}>
      {icon}
    </Button>
  </Tooltip>
);