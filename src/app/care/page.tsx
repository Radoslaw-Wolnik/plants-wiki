// src/app/care/page.tsx
'use client';

import React from 'react';
import { CareDashboard } from '@/components/features/care/CareDashboard';
import { useAuth } from '@/hooks';
import { redirect } from 'next/navigation';

export default function PlantCarePage() {
  const { user } = useAuth();

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Plant Care Management</h1>
      <CareDashboard />
    </div>
  );
}