// src/components/features/plants/PlantGrid.tsx
import React from 'react';
import { Card, Badge } from '@/components/ui';
import { Plant } from '@/types';
import { Sun, Droplets, ThermometerSnowflake } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PlantGridProps {
  plants: Plant[];
}

export const PlantGrid: React.FC<PlantGridProps> = ({ plants }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plants.map((plant) => (
        <Link key={plant.id} href={`/plants/${plant.id}`}>
          <Card className="h-full hover:shadow-lg transition-shadow">
            <div className="aspect-square relative">
              <Image
                src={plant.icon}
                alt={plant.name}
                fill
                className="object-cover rounded-t-lg"
              />
              {plant.petSafe && (
                <Badge
                  variant="success"
                  className="absolute top-2 right-2"
                >
                  Pet Safe
                </Badge>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{plant.name}</h3>
              <p className="text-sm text-neutral-600 italic">
                {plant.scientificName}
              </p>
              
              <div className="mt-4 flex space-x-4 text-sm text-neutral-600">
                <div className="flex items-center">
                  <Sun className="h-4 w-4 mr-1" />
                  {plant.light}
                </div>
                <div className="flex items-center">
                  <Droplets className="h-4 w-4 mr-1" />
                  {plant.humidity}
                </div>
                <div className="flex items-center">
                  <ThermometerSnowflake className="h-4 w-4 mr-1" />
                  {plant.temperature}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};