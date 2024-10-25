// src/app/moderation/dashboard/page.tsx
'use client';

import React from 'react';
import { ModerationDashboard } from '@/components/features/moderation/ModerationDashboard';
import { useAuth } from '@/hooks';
import { Alert } from '@/components/ui';
import { redirect } from 'next/navigation';

export default function ModerationPage() {
  const { user } = useAuth();

  if (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR')) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Moderation Dashboard</h1>
      <ModerationDashboard />
    </div>
  );
}