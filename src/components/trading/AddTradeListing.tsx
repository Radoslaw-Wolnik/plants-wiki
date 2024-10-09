// src/components/trading/AddTradeListing.tsx

import React, { useState } from 'react';
import Modal from '../common/Modal';
import ImageUpload from '../common/ImageUpload';

interface AddTradeListingProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (listingData: { plantName: string; description: string; image: string }) => void;
}

const AddTradeListing: React.FC<AddTradeListingProps> = ({ isOpen, onClose, onAdd }) => {
  const [plantName, setPlantName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ plantName, description, image });
    setPlantName('');
    setDescription('');
    setImage('');
  };

  const handleImageUpload = (imageUrl: string) => {
    setImage(imageUrl);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Add Trade Listing</h2>
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows={3}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Plant Image</label>
          <ImageUpload onUpload={handleImageUpload} />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Create Listing
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTradeListing;