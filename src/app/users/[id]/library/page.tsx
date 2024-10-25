// src/app/users/[id]/library/page.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useUserProfile } from '@/hooks/useUserProfile';
import { PlantList } from '@/components/features/plants/PlantList';
import { Alert } from '@/components/ui';

export default function UserLibraryPage() {
  const { id } = useParams();
  const { profile, canViewLibrary, isLoading } = useUserProfile(Number(id));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!canViewLibrary) {
    return (
      <Alert variant="warning">
        You need to be friends with this user to view their library
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        {profile?.username}'s Plant Library
      </h1>
      {profile?.library?.userPlants && (
        <PlantList plants={profile.library.userPlants.map(up => up.plant)} />
      )}
    </div>
  );
}
