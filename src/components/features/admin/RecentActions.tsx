// src/components/features/admin/RecentActions.tsx
import React from 'react';
import { Card } from '@/components/ui';
import { formatDate } from '@/utils/general.util';

interface RecentActionsProps {
  actions: {
    id: number;
    type: string;
    action: string;
    moderator: string;
    target: string;
    createdAt: string;
  }[];
}

export const RecentActions: React.FC<RecentActionsProps> = ({ actions }) => {
  return (
    <Card>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Actions</h2>
        <div className="space-y-4">
          {actions.map((action) => (
            <div key={action.id} className="border-b last:border-b-0 pb-4 last:pb-0">
              <p className="font-medium">
                {action.moderator} - {action.action}
              </p>
              <p className="text-sm text-neutral-600">
                {action.type}: {action.target}
              </p>
              <p className="text-xs text-neutral-500">
                {formatDate(action.createdAt)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};