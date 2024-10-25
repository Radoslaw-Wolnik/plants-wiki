// src/app/articles/new/page.tsx
'use client';

import React from 'react';
import { ArticleEditor } from '@/components/features/articles/ArticleEditor';
import { useAuth } from '@/contexts/AuthContext';
import { Alert } from '@/components/ui';
import { useRouter } from 'next/navigation';

export default function NewArticlePage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/auth/signin');
    return null;
  }

  const handleSave = (articleId: number) => {
    router.push(`/articles/${articleId}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Article</h1>
      <ArticleEditor onSave={handleSave} />
    </div>
  );
}