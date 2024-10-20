// src/app/graveyard/page.tsx

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import GraveyardItem from '@/components/GraveyardItem';
import AddToGraveyardModal from '@/components/AddToGraveyardModal';

const GraveyardPage: React.FC = () => {
  const [graveyardItems, setGraveyardItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchGraveyard();
  }, []);

  const fetchGraveyard = async () => {
    const response = await fetch('/api/users/graveyard');
    const data = await response.json();
    setGraveyardItems(data);
  };

  const handleAddToGraveyard = async (plantData) => {
    const response = await fetch('/api/users/graveyard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plantData),
    });

    if (response.ok) {
      fetchGraveyard();
      setIsAddModalOpen(false);
    }
  };

  const handleRemoveFromGraveyard = async (itemId) => {
    const response = await fetch(`/api/users/graveyard?id=${itemId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchGraveyard();
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Plant Graveyard</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Add to Graveyard
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {graveyardItems.map((item) => (
          <GraveyardItem
            key={item.id}
            item={item}
            onRemove={() => handleRemoveFromGraveyard(item.id)}
          />
        ))}
      </div>
      <AddToGraveyardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddToGraveyard}
      />
    </Layout>
  );
};

export default GraveyardPage;