// src/components/features/articles/RevisionHistory.tsx
import React from 'react';
import { Card, Button } from '@/components/ui';
import { useArticleHistory } from '@/hooks/useArticleHistory';
import { formatDate } from '@/utils/general.util';
import { History, RotateCcw } from 'lucide-react';

interface RevisionHistoryProps {
  articleId: number;
  currentVersion: string;
}

export const RevisionHistory: React.FC<RevisionHistoryProps> = ({
  articleId,
  currentVersion,
}) => {
  const { revisions, isLoading, revertToRevision } = useArticleHistory(articleId);

  const handleRevert = async (revisionId: number) => {
    if (confirm('Are you sure you want to revert to this version?')) {
      await revertToRevision(revisionId);
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <History className="h-5 w-5 mr-2" />
          <h2 className="text-xl font-semibold">Revision History</h2>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-neutral-100 rounded" />
              ))}
            </div>
          ) : (
            revisions.map((revision) => (
              <div
                key={revision.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    Revision by {revision.author.username}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {formatDate(revision.createdAt)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRevert(revision.id)}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Revert to this version
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};