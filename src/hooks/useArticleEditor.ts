// src/hooks/useArticleEditor.ts
import { useApi } from '@/hooks/useApi';
import { Article, ChangeRequest } from '@/types/global';
import { useToast } from '@/hooks/useToast';

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
      const result = await articleApi.post(data);
      toast.success('Article created successfully');
      return result;
    } catch (err) {
      toast.error('Failed to create article');
      throw err;
    }
  };

  const submitChange = async (data: {
    content: string;
    summary?: string;
  }) => {
    try {
      const result = await changeRequestApi.post(data);
      toast.success('Change request submitted for review');
      return result;
    } catch (err) {
      toast.error('Failed to submit change request');
      throw err;
    }
  };

  return {
    article: articleApi.data,
    isLoading: articleApi.isLoading || changeRequestApi.isLoading,
    error: articleApi.error || changeRequestApi.error,
    createArticle,
    submitChange,
    refreshArticle: articleApi.get,
  };
}