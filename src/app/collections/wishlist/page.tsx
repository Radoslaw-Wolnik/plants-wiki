// src/app/collections/wishlist/page.tsx
'use client';

import React, { useState } from 'react';
import { WishlistItem } from '@/components/features/collections/WishlistItem';
import { AddToWishlistDialog } from '@/components/features/collections/AddToWishlistDialog';
import { Button, Alert } from '@/components/ui';
import { Plus } from 'lucide-react';
import { useWishlist } from '@/hooks/features/plants/useWishlist';
import { useAuth } from '@/hooks';
import { redirect } from 'next/navigation';

export default function WishlistPage() {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { wishlistItems, addToWishlist, removeFromWishlist, isLoading, error } = useWishlist();

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Plant Wishlist</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add to Wishlist
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          Failed to load wishlist items
        </Alert>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-100 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistItems.map((item) => (
            <WishlistItem
              key={item.id}
              item={item}
              onRemove={removeFromWishlist}
            />
          ))}
        </div>
      )}

      <AddToWishlistDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={addToWishlist}
      />
    </div>
  );
}
