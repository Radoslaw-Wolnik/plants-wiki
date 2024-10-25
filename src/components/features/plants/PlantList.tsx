// src/components/features/plants/PlantList.tsx
import React from 'react';
import { Plant } from '@/types';
import { Card, Button } from '@/components/ui';
import Image from 'next/image';
import { Plus } from 'lucide-react';

interface PlantListProps {
  plants: Plant[];
  onAddPlant?: (plant: Plant) => void;
  isSelectable?: boolean;
}

export const PlantList: React.FC<PlantListProps> = ({ 
  plants, 
  onAddPlant,
  isSelectable = false 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {plants.map((plant) => (
        <Card key={plant.id} className="relative overflow-hidden group">
          <div className="aspect-square relative">
            <Image
              src={plant.icon}
              alt={plant.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold">{plant.name}</h3>
            <p className="text-sm text-neutral-500 italic">{plant.scientificName}</p>
            
            {isSelectable && onAddPlant && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                onClick={() => onAddPlant(plant)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add to Library
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};