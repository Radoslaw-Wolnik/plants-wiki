// src/pages/library/page.tsx

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import RoomCard from '../../components/plants/RoomCard';
import AddPlantModal from '../../components/plants/AddPlantModal';

const UserLibraryPage: React.FC = () => {
  const [rooms, setRooms] = useState([]);
  const [isAddPlantModalOpen, setIsAddPlantModalOpen] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const response = await fetch('/api/users/rooms');
    const data = await response.json();
    setRooms(data);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Plant Library</h1>
        <button
          onClick={() => setIsAddPlantModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Add Plant
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
      <AddPlantModal
        isOpen={isAddPlantModalOpen}
        onClose={() => setIsAddPlantModalOpen(false)}
        onAddPlant={fetchRooms}
      />
    </Layout>
  );
};

export default UserLibraryPage;