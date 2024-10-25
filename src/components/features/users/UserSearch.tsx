// src/components/features/users/UserSearch.tsx
import React from 'react';
import { Card, Input, Avatar } from '@/components/ui';
import { useUserSearch } from '@/hooks/features/users/useUserSearch';
import { Search } from 'lucide-react';
import Link from 'next/link';

export const UserSearch: React.FC = () => {
  const { users, isLoading, searchTerm, setSearchTerm } = useUserSearch();

  return (
    <div className="space-y-4">
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
        className="w-full"
        leftIcon={<Search className="h-4 w-4 text-neutral-500" />}
      />

      <div className="space-y-2">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-neutral-200 rounded-full" />
                <div className="h-4 bg-neutral-200 rounded w-1/4" />
              </div>
            </Card>
          ))
        ) : (
          users.map((user) => (
            <Link key={user.id} href={`/users/${user.id}`}>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <Avatar
                    src={user.profilePicture}
                    alt={user.username}
                    size="sm"
                  />
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-neutral-600">
                      {user._count?.plants || 0} plants
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};