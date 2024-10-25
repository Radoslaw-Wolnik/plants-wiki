// useRooms.ts
import { useApi, useToast } from '@/hooks';
import { Room } from '@/types';
import { 
  getAllRooms,
  createRoom as createRoomApi,
  updateRoom as updateRoomApi,
  deleteRoom as deleteRoomApi,
  moveUserPlantToRoom
} from '@/lib/api';

export function useRooms() {
  const { data, error, isLoading, get } = useApi<Room[]>('/users/rooms');
  const toast = useToast();

  const createRoom = async (roomData: {
    name: string;
    type: Room['type'];
    sunlight: string;
    humidity: string;
  }) => {
    try {
      await createRoomApi(roomData);
      toast.success('Room created successfully');
      await getAllRooms();
    } catch (err) {
      toast.error('Failed to create room');
      throw err;
    }
  };

  const updateRoom = async (roomId: number, updates: Partial<Room>) => {
    try {
      await updateRoomApi(roomId, updates);
      toast.success('Room updated successfully');
      await getAllRooms();
    } catch (err) {
      toast.error('Failed to update room');
      throw err;
    }
  };

  const deleteRoom = async (roomId: number) => {
    try {
      await deleteRoomApi(roomId);
      toast.success('Room deleted successfully');
      await getAllRooms();
    } catch (err) {
      toast.error('Failed to delete room');
      throw err;
    }
  };

  const movePlant = async (plantId: number, roomId: number) => {
    try {
      await moveUserPlantToRoom(plantId, roomId);
      toast.success('Plant moved successfully');
      await getAllRooms();
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
    movePlantToRoom: movePlant,
    refreshRooms: getAllRooms,
  };
}