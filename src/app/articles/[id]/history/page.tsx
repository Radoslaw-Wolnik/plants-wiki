// src/app/articles/[id]/history/page.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { RevisionHistory } from '@/components/features/articles/RevisionHistory';
import { useArticleEditor } from '@/hooks/useArticleEditor';
import { Alert } from '@/components/ui';

export default function ArticleHistoryPage() {
  const { id } = useParams();
  const { article, isLoading, error } = useArticleEditor(Number(id));

  if (error) {
    return (
      <Alert variant="danger">
        Failed to load article history. Please try again later.
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Article History</h1>
      <RevisionHistory
        articleId={Number(id)}
        currentVersion={article?.content ?? ''}
      />
    </div>
  );
}