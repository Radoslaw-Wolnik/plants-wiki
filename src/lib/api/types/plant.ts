// src/lib/api/types/plant.ts
export interface Plant {
    id: number;
    name: string;
    scientificName: string;
    commonName: string;
    family: string;
    icon: string;
    light: string;
    temperature: string;
    soil: string;
    climate: string;
    humidity: string;
    growthCycle: string;
    toxicity: string;
    petSafe: boolean;
    plantType: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface PlantVerification extends Omit<Plant, 'id' | 'createdAt' | 'updatedAt'> {
    image: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    submittedById: number;
    reviewedById?: number;
  }
  