// src/app/articles/[id]/changes/page.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, Alert, Button } from '@/components/ui';
import { ChangeRequestViewer } from '@/components/features/articles/ChangeRequestViewer';
import { useAuth, useApi } from '@/hooks';
import { ChangeRequest } from '@/types';

export default function ChangeRequestsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: changeRequests, isLoading, error, refresh } = 
    useApi<ChangeRequest[]>(`/articles/${id}/change-requests`);

  const handleApprove = async (changeRequestId: number) => {
    try {
      await fetch(`/api/articles/${id}/change-requests/${changeRequestId}/approve`, {
        method: 'POST',
      });
      refresh();
    } catch (err) {
      console.error('Failed to approve change request:', err);
    }
  };

  const handleReject = async (changeRequestId: number) => {
    try {
      await fetch(`/api/articles/${id}/change-requests/${changeRequestId}/reject`, {
        method: 'POST',
      });
      refresh();
    } catch (err) {
      console.error('Failed to reject change request:', err);
    }
  };

  if (error) {
    return (
      <Alert variant="danger">
        Failed to load change requests. Please try again later.
      </Alert>
    );
  }

  const canModerate = user?.role === 'ADMIN' || user?.role === 'MODERATOR';

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <div className="p-6">
          <h1 className="text-3xl font-bold">Change Requests</h1>
          <p className="text-neutral-600 mt-2">
            Review and manage proposed changes to this article.
          </p>
        </div>
      </Card>

      <div className="space-y-6">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-neutral-100 rounded-lg" />
            ))}
          </div>
        ) : (
          changeRequests?.map((changeRequest) => (
            <ChangeRequestViewer
              key={changeRequest.id}
              changeRequest={changeRequest}
              onApprove={() => handleApprove(changeRequest.id)}
              onReject={() => handleReject(changeRequest.id)}
              showActions={canModerate}
            />
          ))
        )}

        {changeRequests?.length === 0 && (
          <Alert>No change requests found for this article.</Alert>
        )}
      </div>
    </div>
  );
}