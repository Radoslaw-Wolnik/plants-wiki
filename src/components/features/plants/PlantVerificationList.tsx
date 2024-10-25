// src/components/features/plants/PlantVerificationList.tsx
import React from 'react';
import { Card, Badge, Button } from '@/components/ui';
import { formatDate } from '@/utils/general.util';
import { PlantVerification } from '@/types';

interface PlantVerificationListProps {
  submissions: PlantVerification[];
  onReview: (submissionId: number, decision: 'APPROVED' | 'REJECTED') => void;
}

export const PlantVerificationList: React.FC<PlantVerificationListProps> = ({
  submissions,
  onReview,
}) => {
  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <Card key={submission.id}>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{submission.name}</h3>
                <p className="text-sm text-neutral-500 italic">
                  {submission.scientificName}
                </p>
              </div>
              <Badge variant={getStatusVariant(submission.status)}>
                {submission.status}
              </Badge>
            </div>
            
            <div className="mt-4">
              <p className="text-sm">
                Submitted by: {submission.submittedById}
              </p>
              <p className="text-sm">
                Date: {formatDate(submission.createdAt)}
              </p>
            </div>

            {submission.status === 'PENDING' && (
              <div className="mt-4 space-x-2">
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => onReview(submission.id, 'APPROVED')}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onReview(submission.id, 'REJECTED')}
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return 'success';
    case 'REJECTED':
      return 'danger';
    default:
      return 'default';
  }
};