// src/hooks/useRooms.ts
import { useApi } from '@/hooks/useApi';
import { Room } from '@/types/global';
import { useToast } from '@/hooks/useToast';

export function useRooms() {
  const { data, error, isLoading, get, post, put, delete: del } = 
    useApi<Room[]>('/users/rooms');
  const toast = useToast();

  const createRoom = async (roomData: {
    name: string;
    type: string;
    sunlight: string;
    humidity: string;
  }) => {
    try {
      await post(roomData);
      toast.success('Room created successfully');
      await get();
    } catch (err) {
      toast.error('Failed to create room');
      throw err;
    }
  };

  const updateRoom = async (roomId: number, updates: Partial<Room>) => {
    try {
      await put(updates);
      toast.success('Room updated successfully');
      await get();
    } catch (err) {
      toast.error('Failed to update room');
      throw err;
    }
  };

  const deleteRoom = async (roomId: number) => {
    try {
      await del();
      toast.success('Room deleted successfully');
      await get();
    } catch (err) {
      toast.error('Failed to delete room');
      throw err;
    }
  };

  const movePlantToRoom = async (plantId: number, roomId: number) => {
    try {
      await fetch(`/api/users/plants/${plantId}/move`, {
        method: 'PUT',
        body: JSON.stringify({ roomId }),
      });
      toast.success('Plant moved successfully');
      await get();
    } catch (err) {
      toast.error('Failed to move plant');
      throw err;
    }
  };

  return {
    rooms: data ?? [],
    isLoading,
    error,
    createRoom,
    updateRoom,
    deleteRoom,
    movePlantToRoom,
    refreshRooms: get,
  };
}