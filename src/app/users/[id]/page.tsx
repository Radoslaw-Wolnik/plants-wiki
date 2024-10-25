// src/app/users/[id]/page.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { UserProfileView } from '@/components/features/users/UserProfileView';

export default function UserProfilePage() {
  const { id } = useParams();

  return (
    <div className="container mx-auto py-8">
      <UserProfileView userId={Number(id)} />
    </div>
  );
}
