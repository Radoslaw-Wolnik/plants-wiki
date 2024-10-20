// src/components/plants/UserPlantSelector.tsx

import React, { useState, useEffect } from 'react';
import { PlantSelector } from '../common';
import { Plant } from '@/types/global';

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
      <PlantSelector
        plants={userPlants}
        selectedPlant={selectedPlant}
        onSelect={handlePlantSelect}
      />
    </div>
  );
};

export default UserPlantSelector;