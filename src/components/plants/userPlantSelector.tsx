// src/components/UserPlantSelector.tsx

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Plant {
  id: number;
  name: string;
  image: string;
}

interface UserPlantSelectorProps {
  onSelect: (plant: Plant | null) => void;
}

const UserPlantSelector: React.FC<UserPlantSelectorProps> = ({ onSelect }) => {
  const [userPlants, setUserPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  useEffect(() => {
    fetchUserPlants();
  }, []);

  const fetchUserPlants = async () => {
    const response = await fetch('/api/users/plants');
    const data = await response.json();
    setUserPlants(data);
  };

  const handlePlantSelect = (plant: Plant) => {
    setSelectedPlant(plant);
    onSelect(plant);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Select a plant to offer:</h3>
      <div className="grid grid-cols-2 gap-4">
        {userPlants.map((plant) => (
          <div
            key={plant.id}
            className={`border p-2 rounded-lg cursor-pointer ${
              selectedPlant?.id === plant.id ? 'border-green-500' : 'border-gray-300'
            }`}
            onClick={() => handlePlantSelect(plant)}
          >
            <Image
              src={plant.image}
              alt={plant.name}
              width={100}
              height={100}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
            <p className="text-center">{plant.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPlantSelector;