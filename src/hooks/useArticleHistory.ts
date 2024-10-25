// src/hooks/useArticleEditor.ts
import { useApi } from '@/hooks/useApi';
import { Article } from '@/types/global';
import { useToast } from '@/hooks/useToast';
import { useState } from 'react';

interface ArticleContent {
  title: string;
  content: string;
  plantId?: number;
  images: string[];
}

export function useArticleEditor(articleId?: number) {
  const [content, setContent] = useState<ArticleContent>({
    title: '',
    content: '',
    images: [],
  });
  const { post, put } = useApi<Article>(articleId ? `/articles/${articleId}` : '/articles');
  const toast = useToast();

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/articles/images', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const { url } = await response.json();
    return url;
  };

  const saveArticle = async (isDraft: boolean = false) => {
    try {
      const method = articleId ? put : post;
      const result = await method({
        ...content,
        status: isDraft ? 'DRAFT' : 'PUBLISHED',
      });
      
      toast.success(
        isDraft ? 'Draft saved successfully' : 'Article published successfully'
      );
      return result;
    } catch (err) {
      toast.error('Failed to save article');
      throw err;
    }
  };

  return {
    content,
    setContent,
    uploadImage,
    saveArticle,
  };
}