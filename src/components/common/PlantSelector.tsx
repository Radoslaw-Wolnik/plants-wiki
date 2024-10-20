// src/components/common/PlantSelector.tsx

import React from 'react';
import Image from 'next/image';
import Card from './Card';
import { Plant } from '@/types/global';

interface PlantSelectorProps {
  plants: Plant[];
  selectedPlant: Plant | null;
  onSelect: (plant: Plant) => void;
}

const PlantSelector: React.FC<PlantSelectorProps> = ({ plants, selectedPlant, onSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {plants.map((plant) => (
        <Card
          key={plant.id}
          className={`cursor-pointer ${
            selectedPlant?.id === plant.id ? 'border-2 border-green-500' : ''
          }`}
          onClick={() => onSelect(plant)}
        >
          <Image
            src={plant.icon}
            alt={plant.name}
            width={100}
            height={100}
            className="w-full h-32 object-cover rounded-t-lg"
          />
          <div className="p-2 text-center">
            <p className="font-semibold">{plant.name}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PlantSelector;