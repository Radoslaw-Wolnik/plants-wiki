// src/components/users/GraveyardItem.tsx

import React from 'react';
import { formatDate } from '@/utils/general.util';

interface GraveyardItemProps {
  item: {
    id: number;
    plantName: string;
    startDate: string;
    endDate: string;
  };
  onRemove: (id: number) => void;
}

const GraveyardItem: React.FC<GraveyardItemProps> = ({ item, onRemove }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-2">{item.plantName}</h3>
      <p className="text-sm text-gray-600 mb-1">
        Lifespan: {formatDate(item.startDate)} - {formatDate(item.endDate)}
      </p>
      <button
        onClick={() => onRemove(item.id)}
        className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm"
      >
        Remove
      </button>
    </div>
  );
};

export default GraveyardItem;