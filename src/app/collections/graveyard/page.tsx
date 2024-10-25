// src/app/collections/graveyard/page.tsx
'use client';

import React, {useState} from 'react';
import { GraveyardItem } from '@/components/features/collections/GraveyardItem';
import { Button, Alert } from '@/components/ui';
import { Plus } from 'lucide-react';
import { useGraveyard } from '@/hooks/features/plants/useGraveyard';
import { useAuth } from '@/hooks';
import { redirect } from 'next/navigation';

export default function GraveyardPage() {
  const { user } = useAuth();
  const { graveyardItems, removeFromGraveyard, isLoading, error } = useGraveyard();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Plant Graveyard</h1>
          <p className="text-neutral-600 mt-2">
            Remembering the plants that have passed on
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Memorial
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          Failed to load graveyard entries
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-neutral-100 animate-pulse rounded-lg" />
          ))
        ) : (
          graveyardItems.map((item) => (
            <GraveyardItem
              key={item.id}
              item={item}
              onRemove={removeFromGraveyard}
            />
          ))
        )}
      </div>

      <AddToGraveyardDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={addToGraveyard}
      />
    </div>
  );
}