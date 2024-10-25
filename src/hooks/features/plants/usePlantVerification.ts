// src/hooks/usePlantVerification.ts
import { useApi, useAuth } from '@/hooks';
import { PlantVerification } from '@/types';

export function usePlantVerification() {
  const { user } = useAuth();
  const { data, get, put, isLoading, error } = 
    useApi<PlantVerification[]>('/plants/verifications');

  const reviewSubmission = async (
    submissionId: number,
    decision: 'APPROVED' | 'REJECTED',
    feedback?: string
  ) => {
    return await put(`${submissionId}`, {
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