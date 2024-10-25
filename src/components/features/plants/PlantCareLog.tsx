// src/components/features/plants/PlantCareLog.tsx
import React from 'react';
import { Card, Button, Input } from '@/components/ui';
import { WateringLog, FertilizingLog } from '@/types';
import { formatDate } from '@/utils/general.util';

interface PlantCareLogProps {
  wateringLogs: WateringLog[];
  fertilizingLogs: FertilizingLog[];
  onAddWatering: (amount: number) => Promise<void>;
  onAddFertilizing: (data: { fertilizer: string; amount: number }) => Promise<void>;
}

export const PlantCareLog: React.FC<PlantCareLogProps> = ({
  wateringLogs,
  fertilizingLogs,
  onAddWatering,
  onAddFertilizing,
}) => {
  const [waterAmount, setWaterAmount] = React.useState<string>('');
  const [fertilizerData, setFertilizerData] = React.useState({
    fertilizer: '',
    amount: '',
  });

  const handleWatering = async () => {
    if (!waterAmount) return;
    await onAddWatering(parseFloat(waterAmount));
    setWaterAmount('');
  };

  const handleFertilizing = async () => {
    if (!fertilizerData.fertilizer || !fertilizerData.amount) return;
    await onAddFertilizing({
      fertilizer: fertilizerData.fertilizer,
      amount: parseFloat(fertilizerData.amount),
    });
    setFertilizerData({ fertilizer: '', amount: '' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Watering History</h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="number"
                value={waterAmount}
                onChange={(e) => setWaterAmount(e.target.value)}
                placeholder="Amount (ml)"
              />
              <Button onClick={handleWatering}>Add Watering</Button>
            </div>
            <div className="space-y-2">
              {wateringLogs.map((log) => (
                <div key={log.id} className="text-sm">
                  {formatDate(log.date)} - {log.amount}ml
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Fertilizing History</h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={fertilizerData.fertilizer}
                onChange={(e) => setFertilizerData(prev => ({ 
                  ...prev, 
                  fertilizer: e.target.value 
                }))}
                placeholder="Fertilizer type"
              />
              <Input
                type="number"
                value={fertilizerData.amount}
                onChange={(e) => setFertilizerData(prev => ({ 
                  ...prev, 
                  amount: e.target.value 
                }))}
                placeholder="Amount (g)"
              />
              <Button onClick={handleFertilizing}>Add Fertilizing</Button>
            </div>
            <div className="space-y-2">
              {fertilizingLogs.map((log) => (
                <div key={log.id} className="text-sm">
                  {formatDate(log.date)} - {log.fertilizer} ({log.amount}g)
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
