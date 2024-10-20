// src/app/trading/page.tsx

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import TradeListingCard from '@/components/TradeListingCard';
import AddTradeListing from '@/components/trading/AddTradeListing';

interface TradeListing {
  id: number;
  plantName: string;
  description: string;
  image: string;
  user: {
    id: number;
    username: string;
  };
}

const PlantTradingPage: React.FC = () => {
  const { data: session } = useSession();
  const [tradeListings, setTradeListings] = useState<TradeListing[]>([]);
  const [isAddListingModalOpen, setIsAddListingModalOpen] = useState(false);

  useEffect(() => {
    fetchTradeListings();
  }, []);

  const fetchTradeListings = async () => {
    const response = await fetch('/api/trades');
    const data = await response.json();
    setTradeListings(data);
  };

  const handleAddListing = async (listingData: Omit<TradeListing, 'id' | 'user'>) => {
    const response = await fetch('/api/trades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listingData),
    });

    if (response.ok) {
      fetchTradeListings();
      setIsAddListingModalOpen(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Plant Trading</h1>
        {session && (
          <button
            onClick={() => setIsAddListingModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Listing
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tradeListings.map((listing) => (
          <TradeListingCard key={listing.id} listing={listing} />
        ))}
      </div>
      <AddTradeListing
        isOpen={isAddListingModalOpen}
        onClose={() => setIsAddListingModalOpen(false)}
        onAdd={handleAddListing}
      />
    </Layout>
  );
};

export default PlantTradingPage;