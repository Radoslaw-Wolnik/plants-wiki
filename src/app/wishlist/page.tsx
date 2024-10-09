// src/app/wishlist/page.tsx

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import WishlistItem from '../components/WishlistItem';
import AddToWishlistModal from '../components/AddToWishlistModal';

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const response = await fetch('/api/users/wishlist');
    const data = await response.json();
    setWishlistItems(data);
  };

  const handleAddToWishlist = async (plantName) => {
    const response = await fetch('/api/users/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plantName }),
    });

    if (response.ok) {
      fetchWishlist();
      setIsAddModalOpen(false);
    }
  };

  const handleRemoveFromWishlist = async (itemId) => {
    const response = await fetch(`/api/users/wishlist?id=${itemId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchWishlist();
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Add to Wishlist
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlistItems.map((item) => (
          <WishlistItem
            key={item.id}
            item={item}
            onRemove={() => handleRemoveFromWishlist(item.id)}
          />
        ))}
      </div>
      <AddToWishlistModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddToWishlist}
      />
    </Layout>
  );
};

export default WishlistPage;