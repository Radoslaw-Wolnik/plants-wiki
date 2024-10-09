// src/components/PlantCareTips.tsx

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4">Care Tips</h3>
      <ul className="space-y-4">
        {careTips.map((tip) => (
          <li key={tip.id} className="bg-gray-100 p-4 rounded-lg">
            <p>{tip.content}</p>
            <p className="text-sm text-gray-600 mt-2">
              By {tip.author.username} on {new Date(tip.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
      {session && (
        <form onSubmit={handleAddTip} className="mt-6">
          <textarea
            value={newTip}
            onChange={(e) => setNewTip(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Add a new care tip..."
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Tip
          </button>
        </form>
      )}
    </div>
  );
};

export default PlantCareTips;