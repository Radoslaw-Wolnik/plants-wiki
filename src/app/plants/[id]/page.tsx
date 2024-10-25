// src/app/plants/[id]/page.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PlantDetailView } from '@/components/features/plants/PlantDetailView';
import { usePlantDetails } from '@/hooks/features/plants/usePlantDetails';
import { Alert, Card, Button } from '@/components/ui';
import Image from 'next/image';
import Link from 'next/link';
import { Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function PlantDetailPage() {
  const { id } = useParams();
  const { plant, isLoading, error } = usePlantDetails(Number(id));
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-neutral-200 rounded-lg" />
          <div className="h-8 bg-neutral-200 rounded w-1/3" />
          <div className="h-4 bg-neutral-200 rounded w-1/4" />
        </div>
      </div>
    );
  }

  if (error || !plant) {
    return (
      <Alert variant="danger">
        Failed to load plant details. Please try again.
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{plant.name}</h1>
              <p className="text-lg text-neutral-600 italic">
                {plant.scientificName}
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                Family: {plant.family}
              </p>
            </div>
            {user?.role === 'ADMIN' && (
              <Link href={`/plants/${plant.id}/edit`}>
                <Button variant="ghost">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Plant
                </Button>
              </Link>
            )}
          </div>

          <div className="mt-6 aspect-[16/9] relative rounded-lg overflow-hidden">
            <Image
              src={plant.icon}
              alt={plant.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </Card>

      <PlantDetailView plant={plant} />