// useDiscussions.ts
import { useApi, useToast } from '@/hooks';
import { Discussion } from '@/types';
import { createDiscussion as createDiscussionApi, getDiscussions } from '@/lib/api';

export function useDiscussions(articleId: number) {
  const toast = useToast();
  const { data, error, isLoading, get } = useApi<Discussion[]>(`/articles/${articleId}/discussions`);

  const createDiscussion = async (content: string, parentId?: number) => {
    try {
      await createDiscussionApi(articleId, content, parentId);
      toast.success('Comment posted successfully');
      await getDiscussions(articleId);
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
    refreshDiscussions: () => getDiscussions(articleId),
  };
}