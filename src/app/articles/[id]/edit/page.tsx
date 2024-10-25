// src/app/articles/[id]/edit/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useArticleEditor } from '@/hooks/features/articles/useArticleEditor';
import { ArticleEditor } from '@/components/features/articles/ArticleEditor';
import { Alert, Card, Tabs } from '@/components/ui';
import { useAuth } from '@/hooks';
import { Spinner } from '@/components/ui';


export default function ArticleEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { article, isLoading, error, refreshArticle } = useArticleEditor(Number(id));

  useEffect(() => {
    refreshArticle();
  }, [id]);

  if (!user) {
    router.push('/auth/signin');
    return null;
  }

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

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <div className="p-6">
          <h1 className="text-3xl font-bold">Edit Article</h1>
          <p className="text-neutral-600 mt-2">
            Your changes will be reviewed before being published.
          </p>
        </div>
      </Card>

      <ArticleEditor
        articleId={Number(id)}
        initialContent={article?.content}
      />
    </div>
  );
}
