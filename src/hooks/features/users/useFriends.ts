// src/hooks/useFriends.ts
import { useApi } from '@/hooks/useApi';
import { User } from '@/types/global';
import { useToast } from '@/hooks/ui/useToast';

interface FriendRequest {
  id: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  sender: User;
  receiver: User;
  createdAt: string;
}

export function useFriends() {
  const { data: friends, error, isLoading, get: getFriends } = 
    useApi<User[]>('/users/friends');
  const { data: requests, get: getRequests } = 
    useApi<FriendRequest[]>('/users/friends/requests');
  const toast = useToast();

  const sendFriendRequest = async (userId: number) => {
    try {
      await fetch('/api/users/friends/requests', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
      toast.success('Friend request sent');
      await getRequests();
    } catch (err) {
      toast.error('Failed to send friend request');
      throw err;
    }
  };

  const respondToRequest = async (requestId: number, accept: boolean) => {
    try {
      await fetch(`/api/users/friends/requests/${requestId}`, {
        method: 'PUT',
        body: JSON.stringify({ accept }),
      });
      toast.success(accept ? 'Friend request accepted' : 'Friend request rejected');
      await Promise.all([getFriends(), getRequests()]);
    } catch (err) {
      toast.error('Failed to respond to friend request');
      throw err;
    }
  };

  const removeFriend = async (userId: number) => {
    try {
      await fetch(`/api/users/friends/${userId}`, {
        method: 'DELETE',
      });
      toast.success('Friend removed');
      await getFriends();
    } catch (err) {
      toast.error('Failed to remove friend');
      throw err;
    }
  };

  return {
    friends: friends ?? [],
    friendRequests: requests ?? [],
    isLoading,
    error,
    sendFriendRequest,
    respondToRequest,
    removeFriend,
    refresh: () => Promise.all([getFriends(), getRequests()]),
  };
}
