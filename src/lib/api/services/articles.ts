// src/lib/api/services/articles.ts
import { apiClient } from '../client';
import { PaginatedResponse, PaginationParams, Article, ArticlePhoto, Discussion, ArticleResponse } from '@/types';

export async function getAllArticles(params: PaginationParams) {
  const { data } = await apiClient.get<PaginatedResponse<Article>>('/articles', { params });
  return data;
}

export async function getArticleById(id: number) {
  const { data } = await apiClient.get<ArticleResponse>(`/articles/${id}`);
  return data;
}

export async function createArticle(articleData: {
  title: string;
  content: string;
  plantId: number;
}) {
  const { data } = await apiClient.post<Article>('/articles', articleData);
  return data;
}

export async function uploadArticlePhoto(articleId: number, photo: FormData) {
  const { data } = await apiClient.post<ArticlePhoto>(
    `/articles/${articleId}/photos`,
    photo,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return data;
}

export async function addArticleComment(articleId: number, content: string) {
  const { data } = await apiClient.post<Comment>(`/articles/${articleId}/comments`, { content });
  return data;
}

export async function createDiscussion(articleId: number, content: string, parentId?: number) {
  const { data } = await apiClient.post<Discussion>('/discussions', {
    content,
    articleId,
    parentId,
  });
  return data;
}

export async function getDiscussions(articleId: number) {
  const { data } = await apiClient.get<Discussion[]>(`/discussions?articleId=${articleId}`);
  return data;
}

export async function flagArticle(articleId: number, reason: string) {
  const { data } = await apiClient.post(`/articles/${articleId}/flag`, { reason });
  return data;
}
