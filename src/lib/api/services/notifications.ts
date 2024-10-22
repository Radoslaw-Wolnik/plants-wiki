// src/lib/api/services/notifications.ts
import { apiClient } from '../client';

interface Notification {
  id: number;
  type: 'FRIEND_REQUEST' | 'ARTICLE_COMMENT' | 'CHANGE_REQUEST_APPROVED' | 'CHANGE_REQUEST_REJECTED';
  content: string;
  read: boolean;
  createdAt: string;
}

export async function getAllNotifications() {
  const { data } = await apiClient.get<Notification[]>('/users/notifications');
  return data;
}

export async function markNotificationAsRead(notificationId: number) {
  const { data } = await apiClient.put(`/users/notifications?id=${notificationId}`);
  return data;
}

export async function deleteNotification(notificationId: number) {
  await apiClient.delete(`/users/notifications?id=${notificationId}`);
}
