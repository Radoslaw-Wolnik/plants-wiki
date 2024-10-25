// app/library/[plantId]/page.tsx
'use client';

import React from 'react';
import { useUserPlants, usePlantCare, useRooms } from '@/hooks';
import { Card, Button, Badge, Alert, Tabs } from '@/components/ui';
import { CareScheduleForm } from '@/components/features/care/CareScheduleForm';
import { PlantCareLog } from '@/components/features/plants/PlantCareLog';
import { PlantRoomCard } from '@/components/features/plants/PlantRoomCard';
import { ImageUpload } from '@/components/ui';
import { Sun, Droplets, ThermometerSnowflake, Sprout } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface DetailUserPlantPageProps {
  params: {
    plantId: string;
  };
}

export default function DetailUserPlantPage({ params }: DetailUserPlantPageProps) {
  const plantId = parseInt(params.plantId);
  const { userPlants, isLoading, error } = useUserPlants();
  const { rooms } = useRooms();
  const plantCare = usePlantCare(plantId);

  const userPlant = userPlants.find(p => p.id === plantId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="h-32 bg-neutral-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (error || !userPlant) {
    return <Alert variant="danger">Failed to load plant details</Alert>;
  }

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          {/* Plant Info */}
          <Card>
            <div className="p-6">
              <div className="flex items-start gap-6">
                <div className="relative h-32 w-32 flex-shrink-0">
                  <Image
                    src={userPlant.plant.icon}
                    alt={userPlant.nickname || "plantie"}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold">
                        {userPlant.nickname || userPlant.plant.name}
                      </h1>
                      <p className="text-neutral-600 italic">
                        {userPlant.plant.scientificName}
                      </p>
                    </div>
                    <Link href={`/plants/${userPlant.plant.id}`}>
                      <Button variant="outline" size="sm">
                        View Plant Details
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Sun className="h-5 w-5 text-warning-500" />
                      <span>{userPlant.plant.light}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Droplets className="h-5 w-5 text-info-500" />
                      <span>{userPlant.plant.humidity}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ThermometerSnowflake className="h-5 w-5 text-primary-500" />
                      <span>{userPlant.plant.temperature}</span>
                    </div>
                    {userPlant.plant.petSafe && (
                      <Badge variant="success">Pet Safe</Badge>
                    )}
                  </div>

                  {userPlant.notes && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Notes</h3>
                      <p className="text-neutral-600">{userPlant.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Room */}
          {userPlant.room && (
            <PlantRoomCard room={userPlant.room} />
          )}

          {/* Photos */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Photos</h2>
              <ImageUpload
                multiple
                value={userPlant.photos.map(p => p.url)}
                onChange={() => {}} // Add photo upload handler
              />
              <div className="grid grid-cols-3 gap-4 mt-4">
                {userPlant.photos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square">
                    <Image
                      src={photo.url}
                      alt={photo.description || 'Plant photo'}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'care',
      label: 'Care',
      content: (
        <div className="space-y-6">
          <CareScheduleForm
            plantId={plantId}
            plantName={userPlant.nickname || userPlant.plant.name}
          />
          <PlantCareLog
            wateringLogs={plantCare.wateringLogs}
            fertilizingLogs={plantCare.fertilizingLogs}
            onAddWatering={amount => plantCare.addWateringLog({ 
              amount, 
              date: new Date(),
              notes: null
            })}
            onAddFertilizing={data => plantCare.addFertilizingLog({ 
              ...data,
              date: new Date(),
              notes: null
            })}
          />
        </div>
      ),
    },
  ];

  return <Tabs tabs={tabs} />;
}