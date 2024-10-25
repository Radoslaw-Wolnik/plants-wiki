// useArticleHistory.ts
import { useApi, useToast } from '@/hooks';
import { ArticleRevision } from '@/types';
import { getArticleById } from '@/lib/api';

export function useArticleHistory(articleId: number) {
  const { data, error, isLoading, get, post } = 
    useApi<ArticleRevision[]>(`/articles/${articleId}/history`);
  const toast = useToast();

  const revertToRevision = async (revisionId: number) => {
    try {
      const formData = new FormData();
      formData.append('revisionId', revisionId.toString());
      
      await post(formData);
      toast.success('Successfully reverted to previous version');
      await Promise.all([
        get(),
        getArticleById(articleId)
      ]);
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