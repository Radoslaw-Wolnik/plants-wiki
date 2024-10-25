// useArticleEditor.ts
import { useApi, useToast } from '@/hooks';
import { Article, ChangeRequest } from '@/types';
import { createArticle as createArticleApi, uploadArticlePhoto } from '@/lib/api';

export function useArticleEditor(articleId?: number) {
  const toast = useToast();
  const articleApi = useApi<Article>(`/articles/${articleId}`);
  const changeRequestApi = useApi<ChangeRequest>(`/articles/${articleId}/change-requests`);

  const createArticle = async (data: {
    title: string;
    content: string;
    plantId: number;
  }) => {
    try {
      const result = await createArticleApi(data);
      toast.success('Article created successfully');
      return result;
    } catch (err) {
      toast.error('Failed to create article');
      throw err;
    }
  };

  return {
    article: articleApi.data,
    isLoading: articleApi.isLoading || changeRequestApi.isLoading,
    error: articleApi.error || changeRequestApi.error,
    createArticle,
    refreshArticle: articleApi.get,
  };
}
