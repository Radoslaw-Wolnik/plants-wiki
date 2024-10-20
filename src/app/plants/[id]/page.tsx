// src/pages/plants/[id]/page.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import PlantInfo from '@/components/PlantInfo';
import PlantArticle from '@/components/PlantArticle';

const PlantDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [plant, setPlant] = useState(null);

  useEffect(() => {
    if (id) {
      fetchPlant();
    }
  }, [id]);

  const fetchPlant = async () => {
    const response = await fetch(`/api/plants/${id}`);
    const data = await response.json();
    setPlant(data);
  };

  if (!plant) {
    return <Layout><div>Loading...</div></Layout>;
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">{plant.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PlantInfo plant={plant} />
        <PlantArticle article={plant.article} />
      </div>
    </Layout>
  );
};

export default PlantDetailPage;