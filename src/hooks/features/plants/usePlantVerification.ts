// usePlantVerification.ts
import { useApi, useAuth } from '@/hooks';
import { PlantVerification } from '@/types';
import { processModeratorRequest } from '@/lib/api';

export function usePlantVerification() {
  const { user } = useAuth();
  const { data, get, isLoading, error } = 
    useApi<PlantVerification[]>('/plants/verifications');

  const reviewSubmission = async (
    submissionId: number,
    decision: 'APPROVED' | 'REJECTED',
    feedback?: string
  ) => {
    return await processModeratorRequest(submissionId, decision === 'APPROVED' ? 'approve' : 'reject');
  };

  return {
    submissions: data ?? [],
    fetchSubmissions: get,
    reviewSubmission,
    isLoading,
    error,
  };
}