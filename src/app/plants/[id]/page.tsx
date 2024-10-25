// src/app/plants/[id]/page.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PlantDetailView } from '@/components/features/plants/PlantDetailView';
import { usePlantDetails, useUserPlants, useAuth } from '@/hooks';
import { Alert, Card, Button, Badge } from '@/components/ui';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Edit, 
  Plus, 
  Heart,
  AlertTriangle,
  Share2
} from 'lucide-react';
import { AddToWishlistDialog } from '@/components/features/collections/AddToWishlistDialog';

export default function PlantDetailPage() {
  const { id } = useParams();
  const { plant, isLoading, error } = usePlantDetails(Number(id));
  const { user } = useAuth();
  const { addPlant } = useUserPlants();
  const [showWishlistDialog, setShowWishlistDialog] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToLibrary = async () => {
    try {
      setIsAdding(true);
      await addPlant({
        plantId: Number(id),
      });
      // You might want to show a success toast here
    } catch (err) {
      console.error('Failed to add plant to library:', err);
      // You might want to show an error toast here
    } finally {
      setIsAdding(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${plant?.name} - Plant Wiki`,
        text: `Check out ${plant?.name} (${plant?.scientificName}) on Plant Wiki!`,
        url: window.location.href,
      }).catch(console.error);
    }
  };

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
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold">{plant.name}</h1>
                {plant.petSafe && (
                  <Badge variant="success">Pet Safe</Badge>
                )}
              </div>
              <p className="text-lg text-neutral-600 italic">
                {plant.scientificName}
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                Family: {plant.family}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {user && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowWishlistDialog(true)}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Add to Wishlist
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleAddToLibrary}
                    disabled={isAdding}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Library
                  </Button>
                </>
              )}
              
              <Button variant="ghost" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>

              {user?.role === 'ADMIN' && (
                <Link href={`/plants/${plant.id}/edit`}>
                  <Button variant="ghost">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Plant
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-square relative rounded-lg overflow-hidden">
              <Image
                src={plant.icon}
                alt={plant.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-4">
              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <p className="text-sm text-neutral-600">Light</p>
                  <p className="font-medium">{plant.light}</p>
                </Card>
                
                <Card className="p-4">
                  <p className="text-sm text-neutral-600">Humidity</p>
                  <p className="font-medium">{plant.humidity}</p>
                </Card>
                
                <Card className="p-4">
                  <p className="text-sm text-neutral-600">Temperature</p>
                  <p className="font-medium">{plant.temperature}</p>
                </Card>
                
                <Card className="p-4">
                  <p className="text-sm text-neutral-600">Growth Cycle</p>
                  <p className="font-medium">{plant.growthCycle}</p>
                </Card>
              </div>

              {/* Toxicity Warning if applicable */}
              {!plant.petSafe && (
                <Alert variant="warning">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  This plant is toxic to pets. {plant.toxicity}
                </Alert>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Plant Information */}
      <PlantDetailView plant={plant} />

      {/* Wishlist Dialog */}
      <AddToWishlistDialog
        isOpen={showWishlistDialog}
        onClose={() => setShowWishlistDialog(false)}
      />
    </div>
  );
}