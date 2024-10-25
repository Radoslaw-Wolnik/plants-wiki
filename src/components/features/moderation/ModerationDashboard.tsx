// src/components/features/moderation/ModerationDashboard.tsx
import React from 'react';
import { Card, Button, Badge, Tabs } from '@/components/ui';
import { useModeration } from '@/hooks/features/moderation/useModeration';
import { Shield, Flag, AlertTriangle } from 'lucide-react';

export const ModerationDashboard: React.FC = () => {
  const { stats, queue, handleReport, handleFlag, isLoading } = useModeration();

  const renderQueueItem = (item: any) => {
    switch (item.type) {
      case 'REPORT':
        return (
          <Card key={item.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-warning-500 mr-2" />
                  <h3 className="font-medium">Report #{item.id}</h3>
                </div>
                <p className="text-sm text-neutral-600 mt-1">
                  {item.reason}
                </p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleReport(item.id, 'approve')}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleReport(item.id, 'reject')}
                >
                  Reject
                </Button>
              </div>
            </div>
          </Card>
        );
      
      case 'FLAG':
        return (
          <Card key={item.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <Flag className="h-4 w-4 text-danger-500 mr-2" />
                  <h3 className="font-medium">Flagged Content #{item.id}</h3>
                </div>
                <p className="text-sm text-neutral-600 mt-1">
                  {item.content}
                </p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleFlag(item.id, 'APPROVE')}
                >
                  Keep
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleFlag(item.id, 'REJECT')}
                >
                  Remove
                </Button>
              </div>
            </div>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Change Requests</h3>
              <Badge variant="warning">
                {stats?.pendingChangeRequests ?? 0}
              </Badge>
            </div>
            <p className="text-sm text-neutral-600">
              Pending reviews
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Reports</h3>
              <Badge variant="danger">
                {stats?.pendingReports ?? 0}
              </Badge>
            </div>
            <p className="text-sm text-neutral-600">
              Active reports
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Flagged Content</h3>
              <Badge variant="warning">
                {stats?.flaggedContent ?? 0}
              </Badge>
            </div>
            <p className="text-sm text-neutral-600">
              Items requiring review
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Moderation Queue</h2>
          <div className="space-y-4">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-neutral-100 rounded-lg" />
                ))}
              </div>
            ) : (
              queue.map(renderQueueItem)
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};