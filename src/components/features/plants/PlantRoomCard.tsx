// src/components/features/plants/PlantRoomCard.tsx
import React from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { Room } from '@/types';
import { Sun, Droplets } from 'lucide-react';

interface PlantRoomCardProps {
  room: Room;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const PlantRoomCard: React.FC<PlantRoomCardProps> = ({
  room,
  onEdit,
  onDelete,
}) => {
  return (
    <Card>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{room.name}</h3>
            <Badge variant="secondary" className="mt-1">
              {room.type}
            </Badge>
          </div>
          {(onEdit || onDelete) && (
            <div className="space-x-2">
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button variant="danger" size="sm" onClick={onDelete}>
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm">
            <Sun className="h-4 w-4 mr-2" />
            {room.sunlight}
          </div>
          <div className="flex items-center text-sm">
            <Droplets className="h-4 w-4 mr-2" />
            {room.humidity}
          </div>
        </div>
      </div>
    </Card>
  );
};
