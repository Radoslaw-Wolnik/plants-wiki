// src/app/library/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useUserPlants, usePlantCare } from '@/hooks';
import { PlantList } from '@/components/features/plants/PlantList';
import { PlantCareLog } from '@/components/features/plants/PlantCareLog';
import { PlantRoomCard } from '@/components/features/plants/PlantRoomCard';
import { Tabs, Button, Alert } from '@/components/ui';
import { useAuth } from '@/hooks';
import { Plus } from 'lucide-react';

export default function PlantLibraryPage() {
  const { user } = useAuth();
  const { userPlants, isLoading, error, addPlant, updatePlant, deletePlant } = useUserPlants();
  const [selectedPlant, setSelectedPlant] = useState<number | null>(null);
  const plantCare = usePlantCare(selectedPlant ?? 0);

  const tabs = [
    {
      id: 'plants',
      label: 'My Plants',
      content: (
        <div className="space-y-4">
          {error && (
            <Alert variant="danger">
              There was an error loading your plants. Please try again.
            </Alert>
          )}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Plants</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Plant
            </Button>
          </div>
          <PlantList
            plants={userPlants.map(up => up.plant)}
            onAddPlant={plant => setSelectedPlant(plant.id)}
          />
        </div>
      ),
    },
    {
      id: 'care',
      label: 'Care Logs',
      content: (
        <div className="space-y-4">
          {selectedPlant ? (
            <PlantCareLog
              wateringLogs={plantCare.wateringLogs}
              fertilizingLogs={plantCare.fertilizingLogs}
              onAddWatering={amount => plantCare.addWateringLog({ 
                amount, 
                date: new Date().toISOString() 
              })}
              onAddFertilizing={data => plantCare.addFertilizingLog({ 
                ...data,
                date: new Date().toISOString() 
              })}
            />
          ) : (
            <Alert>Select a plant to view and manage care logs.</Alert>
          )}
        </div>
      ),
    },
    {
      id: 'rooms',
      label: 'Rooms',
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Rooms</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userPlants[0]?.room && (
              <PlantRoomCard
                room={userPlants[0].room}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <Tabs tabs={tabs} />
    </div>
  );
}