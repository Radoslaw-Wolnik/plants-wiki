import React from 'react';
import { Card, Badge, Button } from '@/components/ui';
import { useUsers } from '@/hooks'; // Add this hook to fetch user info
import { formatDate } from '@/utils/general.util';
import { DiffViewer } from './DiffViewer';

interface ChangeRequestViewerProps {
  changeRequest: {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    authorId: number;
    articleId: number;
    previousContent?: string; // Changed from originalContent
  };
  onApprove?: () => void;
  onReject?: () => void;
  showActions?: boolean;
}

export const ChangeRequestViewer: React.FC<ChangeRequestViewerProps> = ({
  changeRequest,
  onApprove,
  onReject,
  showActions = true,
}) => {
  const { getUser } = useUsers(); // Hook to fetch user info
  const [authorName, setAuthorName] = React.useState<string>('');

  React.useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const author = await getUser(changeRequest.authorId);
        setAuthorName(author.username);
      } catch (err) {
        console.error('Failed to fetch author:', err);
      }
    };
    fetchAuthor();
  }, [changeRequest.authorId, getUser]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'danger';
      default: return 'default';
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold">
                Change Request #{changeRequest.id}
              </h3>
              <Badge variant={getStatusColor(changeRequest.status)}>
                {changeRequest.status}
              </Badge>
            </div>
            <p className="text-sm text-neutral-600 mt-1">
              Submitted by {authorName} on{' '}
              {formatDate(changeRequest.createdAt)}
            </p>
          </div>
          {showActions && changeRequest.status === 'PENDING' && (
            <div className="space-x-2">
              <Button
                variant="success"
                size="sm"
                onClick={onApprove}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={onReject}
              >
                Reject
              </Button>
            </div>
          )}
        </div>

        <div className="border rounded-lg overflow-hidden">
          <DiffViewer
            original={changeRequest.previousContent || ''}
            modified={changeRequest.content}
          />
        </div>
      </div>
    </Card>
  );
};