// src/components/features/plants/PlantFilters.tsx
import React from 'react';
import { Card, Select, Input, Toggle } from '@/components/ui';
import { Search } from 'lucide-react';

interface PlantFiltersProps {
  filters: any;
  onFilterChange: (filters: any) => void;
}

export const PlantFilters: React.FC<PlantFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <Card>
      <div className="p-4 space-y-4">
        <Input
          placeholder="Search plants..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          leftIcon={<Search className="h-4 w-4" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Light Level"
            value={filters.light}
            onChange={(value: string) => onFilterChange({ ...filters, light: value })}
            options={[
              { value: '', label: 'All Light Levels' },
              { value: 'low', label: 'Low Light' },
              { value: 'medium', label: 'Medium Light' },
              { value: 'high', label: 'High Light' },
            ]}
          />

          <Select
            label="Difficulty"
            value={filters.difficulty}
            onChange={(value: string) => onFilterChange({ ...filters, difficulty: value })}
            options={[
              { value: '', label: 'All Difficulties' },
              { value: 'beginner', label: 'Beginner' },
              { value: 'intermediate', label: 'Intermediate' },
              { value: 'expert', label: 'Expert' },
            ]}
          />

          <Select
            label="Plant Type"
            value={filters.type}
            onChange={(value: string) => onFilterChange({ ...filters, type: value })}
            options={[
              { value: '', label: 'All Types' },
              { value: 'flowering', label: 'Flowering' },
              { value: 'foliage', label: 'Foliage' },
              { value: 'succulent', label: 'Succulent' },
              { value: 'vine', label: 'Vine' },
            ]}
          />
        </div>

        <Toggle
          label="Pet Safe Only"
          checked={filters.petSafe}
          onChange={(checked) => onFilterChange({ ...filters, petSafe: checked })}
        />
      </div>
    </Card>
  );
};