export interface CareSchedule {
    plantId: number;
    wateringInterval: number;
    fertilizingInterval: number;
    lastWatered?: string;
    lastFertilized?: string;
    nextWatering?: string;
    nextFertilizing?: string;
  }