// src/app/plants/page.tsx
'use client';

import React, { useEffect } from 'react';
import { PlantFilters } from '@/components/features/plants/PlantFilters';
import { PlantGrid } from '@/components/features/plants/PlantGrid';
import { usePlantBrowser } from '@/hooks/features/plants/usePlantBrowser';
import { Button, Alert, Pagination } from '@/components/ui';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks';

export default function PlantsPage() {
  const { 
    plants,
    pagination,
    isLoading,
    error,
    filters,
    setFilters,
    page,
    setPage,
    fetchPlants,
  } = usePlantBrowser();
  const { user } = useAuth();

  useEffect(() => {
    fetchPlants();
  }, [filters, page]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Plants</h1>
        {user?.role === 'ADMIN' && (
          <Link href="/plants/submit">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Plant
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-6">
        <PlantFilters
          filters={filters}
          onFilterChange={setFilters}
        />

        {error ? (
          <Alert variant="danger">
            Failed to load plants. Please try again.
          </Alert>
        ) : (
          <>
            <PlantGrid plants={plants} />
            
            {pagination && (
              <Pagination
                currentPage={page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
