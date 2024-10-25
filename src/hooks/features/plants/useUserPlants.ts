import { useEffect, useState } from 'react';
import { UserPlant, Plant } from '@/types';
import {
  createUserPlant,
  updateUserPlant as updateUserPlantApi,
  getUserPlants,
  moveUserPlantToRoom,
  addPlantToGraveyard,
  getPlantById,
} from '@/lib/api';

interface UserPlantInput {
  plantId: number;
  nickname?: string;
  roomId?: number;
  notes?: string;
}

export function useUserPlants() {
  const [userPlants, setUserPlants] = useState<UserPlant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlantDetails = async (plants: UserPlant[]): Promise<UserPlant[]> => {
    const plantsWithDetails = await Promise.all(
      plants.map(async (plant) => {
        try {
          const plantDetails = await getPlantById(plant.plantId);
          return {
            ...plant,
            plant: {
              id: plantDetails.id,
              name: plantDetails.name,
              // Add any other plant details you need
            },
          };
        } catch (err) {
          console.error(`Failed to fetch details for plant ${plant.plantId}:`, err);
          return plant;
        }
      })
    );
    return plantsWithDetails;
  };

  const fetchUserPlants = async () => {
    setIsLoading(true);
    try {
      const plants = await getUserPlants();
      const plantsWithDetails = await fetchPlantDetails(plants);
      setUserPlants(plantsWithDetails);
    } catch (err) {
      setError("Failed to fetch user plants");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPlants();
  }, []);

  const addPlant = async (plantData: UserPlantInput) => {
    try {
      const newPlant = await createUserPlant(plantData);
      // Fetch plant details for the newly added plant
      const plantWithDetails = await fetchPlantDetails([newPlant]);
      setUserPlants((prev) => [...prev, plantWithDetails[0]]);
    } catch (err) {
      console.error("Error adding plant:", err);
      throw err;
    }
  };

  const updatePlant = async (
    plantId: number,
    updates: Partial<Omit<UserPlant, 'id' | 'plantId' | 'plant'>>
  ) => {
    const formData = new FormData();
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    try {
      const updatedPlant = await updateUserPlantApi(plantId, formData);
      // Fetch updated plant details
      const plantWithDetails = await fetchPlantDetails([updatedPlant]);
      setUserPlants((prev) =>
        prev.map((plant) => (plant.id === plantId ? plantWithDetails[0] : plant))
      );
    } catch (err) {
      console.error("Error updating plant:", err);
      throw err;
    }
  };

  const fetchPlantById = async (plantId: number) => {
    try {
      return await getPlantById(plantId);
    } catch (error) {
      console.error(`Error fetching plant details: ${error}`);
      throw error;
    }
  };

  return {
    userPlants,
    isLoading,
    error,
    addPlant,
    updatePlant,
    fetchPlantById,
    refreshPlants: fetchUserPlants,
  };
}