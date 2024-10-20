// src/pages/plants/page.tsx

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import PlantCard from '@/components/plants/PlantCard';
import Pagination from '@/components/common/Pagination';

const PlantsPage: React.FC = () => {
  const [plants, setPlants] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPlants();
  }, [page, search]);

  const fetchPlants = async () => {
    const response = await fetch(`/api/plants?page=${page}&search=${search}`);
    const data = await response.json();
    setPlants(data.plants);
    setTotalPages(data.totalPages);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Plants</h1>
      <input
        type="text"
        placeholder="Search plants..."
        className="w-full p-2 mb-4 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {plants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </Layout>
  );
};

export default PlantsPage;