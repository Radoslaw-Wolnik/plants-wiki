import React from 'react';
import { Card, Button } from '@/components/ui';
import { Trash, Flower } from 'lucide-react';
import { GraveyardItemResponse } from '@/types/api/users';
import { formatDate } from '@/utils/general.util';

interface GraveyardItemProps {
  item: GraveyardItemResponse;
  onRemove: (itemId: number) => void;
}

export const GraveyardItem: React.FC<GraveyardItemProps> = ({ item, onRemove }) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <Flower className="h-5 w-5 text-neutral-500" />
          <div>
            <h3 className="font-medium">{item.plantName}</h3>
            <p className="text-sm text-neutral-500">
              {formatDate(item.startDate)} - {formatDate(item.endDate)}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id)}
          className="text-danger-500 hover:text-danger-600"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};