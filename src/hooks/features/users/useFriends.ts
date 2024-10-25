// useFriends.ts
import { useApi, useToast } from '@/hooks';
import { User } from '@/types';
import { 
  getFriends,
  addFriend as addFriendApi,
  removeFriend as removeFriendApi
} from '@/lib/api';

interface FriendRequest {
  id: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  sender: User;
  receiver: User;
  createdAt: string;
}

export function useFriends() {
  const { data: friends, error, isLoading, get: getFriendsList } = 
    useApi<User[]>('/users/friends');
  const { data: requests, get: getRequests } = 
    useApi<FriendRequest[]>('/users/friends/requests');
  const toast = useToast();

  const sendFriendRequest = async (userId: number) => {
    try {
      await addFriendApi(userId);
      toast.success('Friend request sent');
      await getRequests();
    } catch (err) {
      toast.error('Failed to send friend request');
      throw err;
    }
  };

  const respondToRequest = async (requestId: number, accept: boolean) => {
    try {
      await addFriendApi(requestId);
      toast.success(accept ? 'Friend request accepted' : 'Friend request rejected');
      await Promise.all([getFriends(), getRequests()]);
    } catch (err) {
      toast.error('Failed to respond to friend request');
      throw err;
    }
  };

  const removeFriend = async (userId: number) => {
    try {
      await removeFriendApi(userId);
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