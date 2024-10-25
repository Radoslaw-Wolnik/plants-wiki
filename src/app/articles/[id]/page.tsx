// src/app/articles/[id]/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useArticleEditor } from '@/hooks/features/articles/useArticleEditor';
import { ArticleViewer } from '@/components/features/articles/ArticleViewer';
import { Alert, Spinner } from '@/components/ui';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const { article, isLoading, error, refreshArticle } = useArticleEditor(Number(id));

  useEffect(() => {
    refreshArticle();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        Failed to load article. Please try again later.
      </Alert>
    );
  }

  if (!article) {
    return (
      <Alert variant="warning">
        Article not found.
      </Alert>
    );
  }

  return <ArticleViewer article={article} />;
}
