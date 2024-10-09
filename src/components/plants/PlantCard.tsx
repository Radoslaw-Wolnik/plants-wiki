// src/components/plants/PlantCard.tsx

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PlantCardProps {
  plant: {
    id: number;
    name: string;
    scientificName: string;
    icon: string;
  };
}

const PlantCard: React.FC<PlantCardProps> = ({ plant }) => (
  <Link href={`/plants/${plant.id}`} className="block">
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Image src={plant.icon} alt={plant.name} width={300} height={200} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{plant.name}</h3>
        <p className="text-sm text-gray-600 italic">{plant.scientificName}</p>
      </div>
    </div>
  </Link>
);

export default PlantCard;