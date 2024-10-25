// useArticleEditor.ts
import { useState } from 'react';
import { useApi, useToast } from '@/hooks';
import { Article, ChangeRequest } from '@/types';
import { createArticle as createArticleApi, uploadArticlePhoto } from '@/lib/api';

export function useArticleEditor(articleId?: number) {
  const toast = useToast();
  const articleApi = useApi<Article>(`/articles/${articleId}`);
  const changeRequestApi = useApi<ChangeRequest>(`/articles/${articleId}/change-requests`);

  const [content, setContent] = useState({
    title: '',
    content: '',
    plantId: undefined,
    images: [] as string[],
  });

  const createArticle = async (data: { title: string; content: string; plantId: number }) => {
    try {
      const result = await createArticleApi(data);
      toast.success('Article created successfully');
      return result;
    } catch (err) {
      toast.error('Failed to create article');
      throw err;
    }
  };

  const saveArticle = async () => {
    // Validate that plantId is set
    if (content.plantId === undefined) {
      toast.error('Plant ID is required to create an article');
      return; // Prevent article creation if plantId is undefined
    }

    try {
      const result = await createArticleApi({
        title: content.title,
        content: content.content,
        plantId: content.plantId, // Now guaranteed to be a number
      });
      toast.success('Article saved successfully');
      return result;
    } catch (err) {
      toast.error('Failed to save article');
      throw err;
    }
  };

  

  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const imageUrl = await uploadArticlePhoto(articleId!, formData);
      // Ensure imageUrl is a string
      if (typeof imageUrl === 'string') {
        setContent((prev) => ({ ...prev, images: [...prev.images, imageUrl] }));
      } else {
        throw new Error('Image upload did not return a valid URL');
      }
      return imageUrl;
    } catch (err) {
      toast.error('Image upload failed');
      throw err;
    }
  };
  

  return {
    article: articleApi.data,
    isLoading: articleApi.isLoading || changeRequestApi.isLoading,
    error: articleApi.error || changeRequestApi.error,
    createArticle,
    saveArticle,
    uploadImage,
    content,
    setContent,
    refreshArticle: articleApi.get,
  };
}
