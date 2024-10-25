import React from 'react';
import { Card, Button } from '@/components/ui';
import { Trash, Heart } from 'lucide-react';
import { WishlistItemResponse } from '@/types/api/users';
import { formatDate } from '@/utils/general.util';

interface WishlistItemProps {
  item: WishlistItemResponse;
  onRemove: (itemId: number) => void;
}

export const WishlistItem: React.FC<WishlistItemProps> = ({ item, onRemove }) => {
  return (
    <Card className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-3">
        <Heart className="h-5 w-5 text-danger-500" />
        <div>
          <h3 className="font-medium">{item.plantName}</h3>
          <p className="text-sm text-neutral-500">
            Added {formatDate(item.createdAt)}
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
    </Card>
  );
};