// src/components/plants/AddPlantModal.tsx

import React, { useState } from 'react';
import { Modal, Form } from '../common';

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlant: (plantData: { plantName: string; roomId: string }) => void;
  rooms: { id: string; name: string }[];
}

const AddPlantModal: React.FC<AddPlantModalProps> = ({ isOpen, onClose, onAddPlant, rooms }) => {
  const [values, setValues] = useState({ plantName: '', roomId: '' });

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (data: Record<string, string>) => {
    onAddPlant(data as { plantName: string; roomId: string });
    setValues({ plantName: '', roomId: '' });
    onClose();
  };

  const fields = [
    { name: 'plantName', label: 'Plant Name', type: 'text' as const, required: true },
    {
      name: 'roomId',
      label: 'Room',
      type: 'select' as const,
      options: rooms.map((room) => ({ value: room.id, label: room.name })),
      required: true,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Plant">
      <Form
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Add Plant"
        values={values}
        onChange={handleChange}
      />
    </Modal>
  );
};

export default AddPlantModal;