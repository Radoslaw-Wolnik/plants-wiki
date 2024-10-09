// src/app/trading/[id]/page.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import TradeListingCard from '../../components/TradeListingCard';
import UserPlantSelector from '../../components/UserPlantSelector';

const TradeProposalPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [listing, setListing] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);

  useEffect(() => {
    if (id) {
      fetchListing();
    }
  }, [id]);

  const fetchListing = async () => {
    const response = await fetch(`/api/trades/${id}`);
    const data = await response.json();
    setListing(data);
  };

  const handleProposeTrade = async () => {
    if (!selectedPlant) return;

    const response = await fetch('/api/trades/propose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listingId: id,
        offeredPlantId: selectedPlant.id,
      }),
    });

    if (response.ok) {
      router.push('/trading');
    }
  };

  if (!listing) {
    return <Layout><div>Loading...</div></Layout>;
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Propose a Trade</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Listing</h2>
          <TradeListingCard listing={listing} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Offer</h2>
          {session ? (
            <>
              <UserPlantSelector onSelect={setSelectedPlant} />
              <button
                onClick={handleProposeTrade}
                disabled={!selectedPlant}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                Propose Trade
              </button>
            </>
          ) : (
            <p>Please sign in to propose a trade.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TradeProposalPage;