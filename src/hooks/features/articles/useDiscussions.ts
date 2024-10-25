// src/hooks/useDiscussions.ts
import { useApi } from '@/hooks/useApi';
import { Discussion } from '@/types/global';
import { useToast } from '@/hooks/ui/useToast';

export function useDiscussions(articleId: number) {
  const toast = useToast();
  const { data, error, isLoading, get, post } = 
    useApi<Discussion[]>(`/articles/${articleId}/discussions`);

  const createDiscussion = async (content: string, parentId?: number) => {
    try {
      await post({ content, parentId });
      toast.success('Comment posted successfully');
      await get();
    } catch (err) {
      toast.error('Failed to post comment');
      throw err;
    }
  };

  return {
    discussions: data ?? [],
    isLoading,
    error,
    createDiscussion,
    refreshDiscussions: get,
  };
}