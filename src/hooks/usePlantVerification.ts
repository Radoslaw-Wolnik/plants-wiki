// src/hooks/usePlantVerification.ts
import { useApi } from '@/hooks/useApi';
import { PlantVerification } from '@/types/global';
import { useAuth } from '@/contexts/AuthContext';

export function usePlantVerification() {
  const { user } = useAuth();
  const { data, get, put, isLoading, error } = 
    useApi<PlantVerification[]>('/plants/verifications');

  const reviewSubmission = async (
    submissionId: number,
    decision: 'APPROVED' | 'REJECTED',
    feedback?: string
  ) => {
    return await put(`/plants/verifications/${submissionId}`, {
      status: decision,
      feedback,
      reviewerId: user?.id,
    });
  };

  return {
    submissions: data ?? [],
    fetchSubmissions: get,
    reviewSubmission,
    isLoading,
    error,
  };
}