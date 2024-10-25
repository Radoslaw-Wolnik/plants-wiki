// src/app/users/search/page.tsx
'use client';

import React from 'react';
import { UserSearch } from '@/components/features/users/UserSearch';

export default function UserSearchPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Find Users</h1>
      <UserSearch />
    </div>
  );
}