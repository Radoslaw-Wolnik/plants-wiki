import React from 'react';
import { Card, Button, Avatar } from '@/components/ui';
import { useFriends } from '@/hooks';
import { UserX } from 'lucide-react';
import Link from 'next/link';

export const FriendsList: React.FC = () => {
  const { friends, removeFriend, isLoading } = useFriends();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-neutral-200" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-neutral-200 rounded" />
                  <div className="h-3 w-24 bg-neutral-200 rounded" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {friends.map((friend) => (
        <Card key={friend.id} className="p-4">
          <div className="flex justify-between items-center">
            <Link 
              href={`/users/${friend.id}`}
              className="flex items-center space-x-4 hover:opacity-80"
            >
              <Avatar
                src={friend.profilePicture}
                alt={friend.username}
                size="md"
              />
              <div>
                <p className="font-medium">{friend.username}</p>
                <p className="text-sm text-neutral-500">
                  {friend.role}
                </p>
              </div>
            </Link>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFriend(friend.id)}
              className="text-danger-500 hover:text-danger-600"
            >
              <UserX className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}

      {friends.length === 0 && (
        <Card className="p-6 text-center text-neutral-500">
          You haven't added any friends yet.
        </Card>
      )}
    </div>
  );
};