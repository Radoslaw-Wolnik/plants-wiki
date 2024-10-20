// src/components/plants/RoomCard.tsx

import React from 'react';
import Link from 'next/link';
import { Card, Button } from '../common';
import { Room } from '@/types/global';

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => (
  <Card>
    <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
    <p className="text-sm text-gray-600 mb-4">{room.type}</p>
    <p className="mb-2">Plants: {room.plants.length}</p>
    <Button as={Link} href={`/rooms/${room.id}`} variant="secondary">
      View Room
    </Button>
  </Card>
);

export default RoomCard;