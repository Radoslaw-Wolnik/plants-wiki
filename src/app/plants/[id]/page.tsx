// File: src/app/plants/[id]/page.tsx

import React from 'react';
import Image from 'next/image';

async function getPlant(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plants/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch plant');
  }
  return res.json();
}

export default async function PlantPage({ params }: { params: { id: string } }) {
  const plant = await getPlant(params.id);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{plant.name}</h1>
      <h2 className="text-xl italic mb-4">{plant.scientificName}</h2>
      <div className="mb-6">
        <Image src={plant.icon} alt={plant.name} width={600} height={400} className="rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-2xl font-semibold mb-2">Description</h3>
          <p>{plant.article?.content || 'No description available.'}</p>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-2">Care Instructions</h3>
          <ul>
            <li><strong>Light:</strong> {plant.light}</li>
            <li><strong>Water:</strong> {plant.water}</li>
            <li><strong>Temperature:</strong> {plant.temperature}</li>
            <li><strong>Humidity:</strong> {plant.humidity}</li>
            <li><strong>Soil:</strong> {plant.soil}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}