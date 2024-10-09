// src/components/plants/PlantCareTips.tsx

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, Button, TextArea } from '../common';
import { formatDate } from '../../utils';

interface CareTip {
  id: number;
  content: string;
  createdAt: string;
  author: {
    username: string;
  };
}

interface PlantCareTipsProps {
  plantId: number;
}

const PlantCareTips: React.FC<PlantCareTipsProps> = ({ plantId }) => {
  const { data: session } = useSession();
  const [careTips, setCareTips] = useState<CareTip[]>([]);
  const [newTip, setNewTip] = useState('');

  useEffect(() => {
    fetchCareTips();
  }, [plantId]);

  const fetchCareTips = async () => {
    const response = await fetch(`/api/plants/${plantId}/care-tips`);
    const data = await response.json();
    setCareTips(data);
  };

  const handleAddTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTip.trim()) return;

    const response = await fetch(`/api/plants/${plantId}/care-tips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newTip }),
    });

    if (response.ok) {
      fetchCareTips();
      setNewTip('');
    }
  };

  // src/components/plants/PlantCareTips.tsx (continued)

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4">Care Tips</h3>
      <Card>
        {careTips.map((tip) => (
          <div key={tip.id} className="mb-4 last:mb-0 p-4 bg-gray-50 rounded-lg">
            <p>{tip.content}</p>
            <p className="text-sm text-gray-600 mt-2">
              By {tip.author.username} on {formatDate(tip.createdAt)}
            </p>
          </div>
        ))}
      </Card>
      {session && (
        <form onSubmit={handleAddTip} className="mt-6">
          <TextArea
            value={newTip}
            onChange={(e) => setNewTip(e.target.value)}
            placeholder="Add a new care tip..."
            rows={3}
          />
          <Button type="submit" className="mt-2">
            Add Tip
          </Button>
        </form>
      )}
    </div>
  );
};

export default PlantCareTips;