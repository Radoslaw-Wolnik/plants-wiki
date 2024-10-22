// src/lib/api/services/articles.ts
import { apiClient } from '../client';
import { Article, Comment, Discussion, ArticlePhoto } from '../types/articles';
import { PaginatedResponse, PaginationParams } from '../types/common';

export const articles = {
  getAll: async (params: PaginationParams) => {
    const { data } = await apiClient.get<PaginatedResponse<Article>>('/articles', { params });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<Article>(`/articles/${id}`);
    return data;
  },

  create: async (articleData: {
    title: string;
    content: string;
    plantId: number;
  }) => {
    const { data } = await apiClient.post<Article>('/articles', articleData);
    return data;
  },

  uploadPhoto: async (articleId: number, photo: FormData) => {
    const { data } = await apiClient.post<ArticlePhoto>(
      `/articles/${articleId}/photos`,
      photo,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return data;
  },

  addComment: async (articleId: number, content: string) => {
    const { data } = await apiClient.post<Comment>(`/articles/${articleId}/comments`, { content });
    return data;
  },

  createDiscussion: async (articleId: number, content: string, parentId?: number) => {
    const { data } = await apiClient.post<Discussion>('/discussions', {
      content,
      articleId,
      parentId,
    });
    return data;
  },

  getDiscussions: async (articleId: number) => {
    const { data } = await apiClient.get<Discussion[]>(`/discussions?articleId=${articleId}`);
    return data;
  },

  flagArticle: async (articleId: number, reason: string) => {
    const { data } = await apiClient.post(`/articles/${articleId}/flag`, { reason });
    return data;
  },
};
