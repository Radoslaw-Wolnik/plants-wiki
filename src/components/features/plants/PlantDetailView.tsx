// src/components/features/plants/PlantDetailView.tsx
import React from 'react';
import { Card, Button, Tabs } from '@/components/ui';
import { usePlantDetails } from '@/hooks/features/plants/usePlantDetails';
import { Plant } from '@/types/global';
import {
  Sun,
  Droplets,
  ThermometerSnowflake,
  Sprout,
  AlertTriangle,
} from 'lucide-react';

interface PlantDetailViewProps {
  plant: Plant;
}

export const PlantDetailView: React.FC<PlantDetailViewProps> = ({ plant }) => {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard
              icon={<Sun className="h-5 w-5 text-warning-500" />}
              label="Light Requirements"
              value={plant.light}
            />
            <InfoCard
              icon={<Droplets className="h-5 w-5 text-info-500" />}
              label="Humidity"
              value={plant.humidity}
            />
            <InfoCard
              icon={<ThermometerSnowflake className="h-5 w-5 text-primary-500" />}
              label="Temperature"
              value={plant.temperature}
            />
            <InfoCard
              icon={<Sprout className="h-5 w-5 text-success-500" />}
              label="Growth Cycle"
              value={plant.growthCycle}
            />
            {plant.toxicity && (
              <InfoCard
                icon={<AlertTriangle className="h-5 w-5 text-danger-500" />}
                label="Toxicity"
                value={plant.toxicity}
              />
            )}
          </div>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Care Instructions</h3>
              <div className="space-y-4">
                <p><strong>Soil:</strong> {plant.soil}</p>
                <p><strong>Climate:</strong> {plant.climate}</p>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'care-tips',
      label: 'Care Tips',
      content: <CareTipsList plantId={plant.id} />,
    },
  ];

  return <Tabs tabs={tabs} />;
};

const InfoCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <Card>
    <div className="p-4">
      <div className="flex items-center space-x-3">
        {icon}
        <div>
          <p className="text-sm text-neutral-600">{label}</p>
          <p className="font-medium">{value}</p>
        </div>
      </div>
    </div>
  </Card>
);
