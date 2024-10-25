import { useEffect, useState } from 'react';
import { UserPlant, Plant } from '@/types';
import { 
  createUserPlant,
  updateUserPlant as updateUserPlantApi,
  getUserPlants,
  moveUserPlantToRoom,
  addPlantToGraveyard,
  getPlantById,
} from '@/lib/api'; // Adjust the import path accordingly

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

  const fetchUserPlants = async () => {
    setIsLoading(true);
    try {
      const plants = await getUserPlants(); // Modify to fetch all user plants if needed
      setUserPlants(plants);
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
      setUserPlants((prev) => [...prev, newPlant]); // Add the new plant to the list
    } catch (err) {
      console.error("Error adding plant:", err);
      throw err; // Optionally handle or log the error
    }
  };

  const updatePlant = async (
    plantId: number,
    updates: Partial<Omit<UserPlant, 'id' | 'plantId'>>
  ) => {
    const formData = new FormData();
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    try {
      const updatedPlant = await updateUserPlantApi(plantId, formData);
      setUserPlants((prev) => 
        prev.map((plant) => (plant.id === updatedPlant.id ? updatedPlant : plant))
      ); // Update the plant in the list
    } catch (err) {
      console.error("Error updating plant:", err);
      throw err; // Optionally handle or log the error
    }
  };

  const fetchPlantById = async (plantId: number) => {
    try {
      const plantDetails = await getPlantById(plantId);
      return plantDetails;
    } catch (error) {
      console.error(`Error fetching plant details: ${error}`);
      throw error; // Rethrow the error for further handling
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
