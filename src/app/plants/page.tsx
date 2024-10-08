// File: src/app/plants/page.tsx

import React from 'react';
import Link from 'next/link';
import PlantCard from '@/components/PlantCard';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';

async function getPlants(search: string = '', page: number = 1) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plants?search=${search}&page=${page}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch plants');
  }
  return res.json();
}

export default async function PlantsPage({ searchParams }: { searchParams: { search?: string; page?: string } }) {
  const search = searchParams.search || '';
  const page = parseInt(searchParams.page || '1');
  const { plants, totalCount, currentPage, totalPages } = await getPlants(search, page);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Plant Database</h1>
      <SearchBar initialSearch={search} />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {plants.map((plant) => (
          <Link key={plant.id} href={`/plants/${plant.id}`}>
            <PlantCard name={plant.name} image={plant.icon} scientificName={plant.scientificName} />
          </Link>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}