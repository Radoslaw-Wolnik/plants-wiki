// src/components/users/AddToGraveyardModal.tsx

import React, { useState } from 'react';
import Modal from '../common/Modal';

interface AddToGraveyardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (plantData: { plantName: string; startDate: string; endDate: string }) => void;
}

const AddToGraveyardModal: React.FC<AddToGraveyardModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [plantName, setPlantName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ plantName, startDate, endDate });
    setPlantName('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Add to Graveyard</h2>
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
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Add to Graveyard
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddToGraveyardModal;