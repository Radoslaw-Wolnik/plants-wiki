// src/hooks/useArticleHistory.ts
import { useApi, useToast } from '@/hooks';
import { ArticleRevision } from '@/types';

interface ArticleRevision {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    username: string;
  };
  changeRequest?: {
    id: number;
    status: 'APPROVED' | 'REJECTED' | 'PENDING';
  };
}

export function useArticleHistory(articleId: number) {
  const { data, error, isLoading, get } = 
    useApi<ArticleRevision[]>(`/articles/${articleId}/history`);
  const toast = useToast();

  const revertToRevision = async (revisionId: number) => {
    try {
      await fetch(`/api/articles/${articleId}/revert`, {
        method: 'POST',
        body: JSON.stringify({ revisionId }),
      });
      toast.success('Successfully reverted to previous version');
      await get();
    } catch (err) {
      toast.error('Failed to revert to selected version');
      throw err;
    }
  };

  return {
    revisions: data ?? [],
    isLoading,
    error,
    revertToRevision,
    refreshHistory: get,
  };
}
