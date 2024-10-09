
// src/app/rooms/page.tsx

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import RoomCard from '../../components/RoomCard';
import AddRoomModal from '../../components/AddRoomModal';

interface Room {
  id: number;
  name: string;
  type: string;
  sunlight: string;
  humidity: string;
}

const RoomManagementPage: React.FC = () => {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);

  useEffect(() => {
    if (session) {
      fetchRooms();
    }
  }, [session]);

  const fetchRooms = async () => {
    const response = await fetch('/api/users/rooms');
    const data = await response.json();
    setRooms(data);
  };

  const handleAddRoom = async (roomData: Omit<Room, 'id'>) => {
    const response = await fetch('/api/users/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomData),
    });

    if (response.ok) {
      fetchRooms();
      setIsAddRoomModalOpen(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Room Management</h1>
        <button
          onClick={() => setIsAddRoomModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Add Room
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} onUpdate={fetchRooms} />
        ))}
      </div>
      <AddRoomModal
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        onAdd={handleAddRoom}
      />
    </Layout>
  );
};

export default RoomManagementPage;