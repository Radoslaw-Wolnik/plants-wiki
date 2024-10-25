// src/components/features/care/CareDashboard.tsx
import React from 'react';
import { CareScheduleForm } from './CareScheduleForm';
import { CareRemindersWidget } from './CareRemindersWidget';
import { PlantCareLog } from '../plants/PlantCareLog';
import { Tabs } from '@/components/ui';
import { useUserPlants } from '@/hooks/features/plants/useUserPlants';
import { usePlantCare } from '@/hooks/features/plants/usePlantCare';

export const CareDashboard: React.FC = () => {
  const { userPlants } = useUserPlants();
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const plantCare = usePlantCare(selectedPlantId ?? 0);

  const renderTabs = () => {
    if (!userPlants.length) {
      return (
        <Alert>
          You haven't added any plants to your library yet.
        </Alert>
      );
    }

    const tabs = userPlants.map(plant => ({
      id: plant.id.toString(),
      label: plant.nickname || plant.plant.name,
      content: (
        <div className="space-y-6">
          <CareScheduleForm
            plantId={plant.id}
            plantName={plant.nickname || plant.plant.name}
          />
          <PlantCareLog
            wateringLogs={plantCare.wateringLogs}
            fertilizingLogs={plantCare.fertilizingLogs}
            onAddWatering={amount => plantCare.addWateringLog({ 
              amount, 
              date: new Date().toISOString() 
            })}
            onAddFertilizing={data => plantCare.addFertilizingLog({ 
              ...data,
              date: new Date().toISOString() 
            })}
          />
        </div>
      ),
    }));

    return <Tabs tabs={tabs} onChange={id => setSelectedPlantId(Number(id))} />;
  };

  return (
    <div className="space-y-6">
      <CareRemindersWidget />
      {renderTabs()}
    </div>
  );
};