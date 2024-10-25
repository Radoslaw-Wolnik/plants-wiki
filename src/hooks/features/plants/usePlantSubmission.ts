// usePlantSubmission.ts
import { PlantVerification } from '@/types';
import { useApi, useToast } from '@/hooks';
import { submitPlantVerification } from '@/lib/api';

interface PlantSubmissionData {
  name: string;
  scientificName: string;
  commonName: string;
  family: string;
  light: string;
  temperature: string;
  soil: string;
  climate: string;
  humidity: string;
  growthCycle: string;
  toxicity: string;
  petSafe: boolean;
  plantType: string;
  icon: string;
  image: string;
}

export function usePlantSubmission() {
  const { isLoading, error } = useApi<PlantVerification>('/plants/verify');
  const toast = useToast();

  const submitPlant = async (data: PlantSubmissionData) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      const result = await submitPlantVerification(formData);
      toast.success('Plant submitted for verification successfully!');
      return result;
    } catch (err) {
      toast.error('Failed to submit plant for verification');
      throw err;
    }
  };

  return {
    submitPlant,
    isLoading,
    error,
  };
}