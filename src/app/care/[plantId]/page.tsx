// src/app/care/[plantId]/page.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CareScheduleForm } from '@/components/features/care/CareScheduleForm';
import { PlantCareLog } from '@/components/features/plants/PlantCareLog';
import { usePlantCare } from '@/hooks/features/plants/usePlantCare';
import { useUserPlants } from '@/hooks/features/plants/useUserPlants';
import { Card, Alert } from '@/components/ui';

export default function PlantCareDetailPage() {
  const { plantId } = useParams();
  const { userPlants } = useUserPlants();
  const plantCare = usePlantCare(Number(plantId));

  const plant = userPlants.find(p => p.id === Number(plantId));

  if (!plant) {
    return (
      <Alert variant="danger">
        Plant not found or you don't have access to it.
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        Care Details: {plant.nickname || plant.plant.name}
      </h1>
      
      <div className="space-y-6">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Plant Information</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-neutral-600">Light</dt>
                <dd className="mt-1">{plant.plant.light}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-neutral-600">Humidity</dt>
                <dd className="mt-1">{plant.plant.humidity}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-neutral-600">Temperature</dt>
                <dd className="mt-1">{plant.plant.temperature}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-neutral-600">Soil</dt>
                <dd className="mt-1">{plant.plant.soil}</dd>
              </div>
            </dl>
          </div>
        </Card>

        <CareScheduleForm
          plantId={plant.id}
          plantName={plant.nickname || plant.plant.name}
        />

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
      </div>
    </div>
  );
}
