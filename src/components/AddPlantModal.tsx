// src/components/AddPlantModal.tsx

import React, { useState } from 'react';
import Modal from './Modal';

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlant: (plantData: any) => void;
}

const AddPlantModal: React.FC<AddPlantModalProps> = ({ isOpen, onClose, onAddPlant }) => {
  const [plantName, setPlantName] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPlant({ plantName, roomId });
    setPlantName('');
    setRoomId('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Add New Plant</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="plantName" className="block text-sm font-medium text-gray-700">
            Plant Name
          </label>
          <input
            type="text"
            id="plantName"
            value={plantName}
            onChange={(e) => setPlantName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
            Room
          </label>
          <select
            id="roomId"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          >
            <option value="">Select a room</option>
            {/* Add room options here */}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Plant
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPlantModal;