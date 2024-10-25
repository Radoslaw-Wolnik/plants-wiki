// src/app/friends/page.tsx
'use client';

import React from 'react';
import { FriendsList } from '@/components/features/friends/FriendsList';
import { FriendRequests } from '@/components/features/friends/FriendRequests';
import { Tabs } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';

export default function FriendsPage() {
  const { user } = useAuth();

  if (!user) {
    redirect('/auth/signin');
  }

  const tabs = [
    {
      id: 'friends',
      label: 'Friends',
      content: <FriendsList />,
    },
    {
      id: 'requests',
      label: 'Friend Requests',
      content: <FriendRequests />,
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Friends</h1>
      <Tabs tabs={tabs} />
    </div>
  );
}