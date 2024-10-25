// src/components/features/care/CareScheduleForm.tsx
import React from 'react';
import { Card, Input, Button, Alert } from '@/components/ui';
import { usePlantCareSchedule } from '@/hooks/usePlantCareSchedule';
import { formatDate } from '@/utils/general.util';

interface CareScheduleFormProps {
  plantId: number;
  plantName: string;
}

export const CareScheduleForm: React.FC<CareScheduleFormProps> = ({ 
  plantId, 
  plantName 
}) => {
  const { 
    schedule, 
    updateSchedule, 
    isLoading, 
    error 
  } = usePlantCareSchedule(plantId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    
    await updateSchedule({
      wateringInterval: Number(data.get('wateringInterval')),
      fertilizingInterval: Number(data.get('fertilizingInterval')),
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <h3 className="text-xl font-semibold">Care Schedule for {plantName}</h3>
        
        {error && (
          <Alert variant="danger">
            Failed to load or update care schedule
          </Alert>
        )}

        <div className="space-y-4">
          <Input
            label="Watering Interval (days)"
            name="wateringInterval"
            type="number"
            defaultValue={schedule?.wateringInterval}
            min={1}
            required
          />

          <Input
            label="Fertilizing Interval (days)"
            name="fertilizingInterval"
            type="number"
            defaultValue={schedule?.fertilizingInterval}
            min={1}
            required
          />

          {schedule?.lastWatered && (
            <p className="text-sm text-neutral-600">
              Last watered: {formatDate(schedule.lastWatered)}
            </p>
          )}

          {schedule?.lastFertilized && (
            <p className="text-sm text-neutral-600">
              Last fertilized: {formatDate(schedule.lastFertilized)}
            </p>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Schedule'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
