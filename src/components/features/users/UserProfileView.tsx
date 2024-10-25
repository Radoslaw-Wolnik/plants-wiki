// src/components/features/users/UserProfileView.tsx
import React from 'react';
import { Card, Badge, Button, Avatar, Alert } from '@/components/ui';
import { useUserProfile } from '@/hooks/features/users/useUserProfile';
import { useFriends } from '@/hooks/features/users/useFriends';
import Link from 'next/link';
import { UserSquare, Book, Flower, Users } from 'lucide-react';

interface UserProfileViewProps {
  userId: number;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ userId }) => {
  const { profile, isLoading, error, isFriend, canViewLibrary } = useUserProfile(userId);
  const { sendFriendRequest } = useFriends();

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-20 w-20 bg-neutral-200 rounded-full" />
          <div className="h-8 bg-neutral-200 rounded w-1/3" />
          <div className="h-4 bg-neutral-200 rounded w-1/2" />
        </div>
      </Card>
    );
  }

  if (error || !profile) {
    return <Alert variant="danger">Failed to load user profile</Alert>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar
                src={profile.profilePicture}
                alt={profile.username}
                size="lg"
              />
              <div>
                <h2 className="text-2xl font-bold">{profile.username}</h2>
                <p className="text-neutral-600">
                  Joined {new Date(profile.createdAt).toLocaleDateString()}
                </p>
                <Badge variant="secondary" className="mt-2">
                  {profile.role}
                </Badge>
              </div>
            </div>
            {!isFriend && (
              <Button onClick={() => sendFriendRequest(profile.id)}>
                Add Friend
              </Button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <Users className="h-6 w-6 mx-auto text-primary-500" />
              <p className="mt-1 font-medium">{profile._count.friends}</p>
              <p className="text-sm text-neutral-600">Friends</p>
            </div>
            <div className="text-center">
              <Flower className="h-6 w-6 mx-auto text-primary-500" />
              <p className="mt-1 font-medium">{profile._count.plants}</p>
              <p className="text-sm text-neutral-600">Plants</p>
            </div>
            <div className="text-center">
              <Book className="h-6 w-6 mx-auto text-primary-500" />
              <p className="mt-1 font-medium">{profile._count.articles}</p>
              <p className="text-sm text-neutral-600">Articles</p>
            </div>
          </div>
        </div>
      </Card>

      {canViewLibrary ? (
        <Card>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Plant Library</h3>
            {profile.library?.userPlants.map((plant) => (
              <div
                key={plant.id}
                className="border-b last:border-b-0 py-3"
              >
                <p className="font-medium">{plant.plant.name}</p>
                {plant.nickname && (
                  <p className="text-sm text-neutral-600">
                    Nicknamed: {plant.nickname}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <p className="text-center text-neutral-600">
            Add {profile.username} as a friend to view their plant library
          </p>
        </Card>
      )}
    </div>
  );
};