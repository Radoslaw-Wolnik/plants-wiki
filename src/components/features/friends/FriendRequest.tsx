// src/components/features/friends/FriendRequests.tsx
import React from 'react';
import { Card, Button, Avatar } from '@/components/ui';
import { useFriends } from '@/hooks/useFriends';

export const FriendRequests: React.FC = () => {
  const { friendRequests, respondToRequest, isLoading } = useFriends();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 bg-neutral-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const pendingRequests = friendRequests.filter(
    (request) => request.status === 'PENDING'
  );

  return (
    <div className="space-y-4">
      {pendingRequests.map((request) => (
        <Card key={request.id}>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar
                src={request.sender.profilePicture}
                alt={request.sender.username}
                size="md"
              />
              <div>
                <p className="font-medium">{request.sender.username}</p>
                <p className="text-sm text-neutral-600">
                  Sent {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="space-x-2">
              <Button
                variant="success"
                size="sm"
                onClick={() => respondToRequest(request.id, true)}
              >
                Accept
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => respondToRequest(request.id, false)}
              >
                Decline
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};