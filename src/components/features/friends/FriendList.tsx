// src/components/features/friends/FriendsList.tsx
import React from 'react';
import { Card, Button, Avatar } from '@/components/ui';
import { useFriends } from '@/hooks/features/users/useFriends';
import Link from 'next/link';

export const FriendsList: React.FC = () => {
  const { friends, removeFriend, isLoading } = useFriends();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-neutral-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {friends.map((friend) => (
        <Card key={friend.id}>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar
                src={friend.profilePicture}
                alt={friend.username}
                size="md"
              />
              <div>
                <Link 
                  href={`/users/${friend.id}`}
                  className="font-medium hover:text-primary-600"
                >
                  {friend.username}
                </Link>
                <p className="text-sm text-neutral-600">
                  {friend.role}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFriend(friend.id)}
            >
              Remove Friend
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};