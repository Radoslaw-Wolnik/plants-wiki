// src/components/trading/AddTradeListing.tsx

import React, { useState } from 'react';
import { Modal, Form, ImageUpload } from '../common';

interface AddTradeListingProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (listingData: { plantName: string; description: string; image: string }) => void;
}

const AddTradeListing: React.FC<AddTradeListingProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    plantName: '',
    description: '',
    image: '',
  });

  const handleSubmit = (data: Record<string, string>) => {
    onAdd(data as { plantName: string; description: string; image: string });
    setFormData({ plantName: '', description: '', image: '' });
    onClose();
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
  };

  const fields = [
    { name: 'plantName', label: 'Plant Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const, required: true },
    {
      name: 'image',
      label: 'Plant Image',
      type: 'custom' as const,
      component: <ImageUpload onUpload={handleImageUpload} />,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Trade Listing">
      <Form
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Create Listing"
        values={formData}
        onChange={handleChange}
      />
    </Modal>
  );
};

export default AddTradeListing;