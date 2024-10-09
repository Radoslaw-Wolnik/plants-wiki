// src/components/TradeListingCard.tsx

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface TradeListingCardProps {
  listing: {
    id: number;
    plantName: string;
    description: string;
    image: string;
    user: {
      id: number;
      username: string;
    };
  };
}

const TradeListingCard: React.FC<TradeListingCardProps> = ({ listing }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <Image
        src={listing.image}
        alt={listing.plantName}
        width={300}
        height={200}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{listing.plantName}</h3>
        <p className="text-gray-600 mb-4">{listing.description}</p>
        <p className="text-sm text-gray-500 mb-4">
          Offered by{' '}
          <Link href={`/users/${listing.user.id}`} className="text-blue-500 hover:underline">
            {listing.user.username}
          </Link>
        </p>
        <Link
          href={`/trading/${listing.id}`}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-block"
        >
          Propose Trade
        </Link>
      </div>
    </div>
  );
};

export default TradeListingCard;