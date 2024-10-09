// src/components/RoomCard.tsx

import React from 'react';
import Link from 'next/link';

interface RoomCardProps {
  room: {
    id: number;
    name: string;
    type: string;
    plants: Array<{ id: number; name: string }>;
  };
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => (
  <div className="bg-white rounded-lg shadow-md p-4">
    <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
    <p className="text-sm text-gray-600 mb-4">{room.type}</p>
    <p className="mb-2">Plants: {room.plants.length}</p>
    <Link href={`/rooms/${room.id}`} className="text-blue-500 hover:underline">
      View Room
    </Link>
  </div>
);

export default RoomCard;