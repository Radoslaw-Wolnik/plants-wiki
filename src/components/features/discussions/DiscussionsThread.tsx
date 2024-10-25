// src/components/features/discussions/DiscussionThread.tsx
import React, { useState } from 'react';
import { Card, Button, Textarea, Avatar } from '@/components/ui';
import { useDiscussions } from '@/hooks/features/articles/useDiscussions';
import { formatDate } from '@/utils/general.util';
import { useAuth } from '@/contexts/AuthContext';

interface DiscussionThreadProps {
  articleId: number;
}

export const DiscussionThread: React.FC<DiscussionThreadProps> = ({ articleId }) => {
  const { user } = useAuth();
  const { discussions, createDiscussion, isLoading } = useDiscussions(articleId);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const handleSubmit = async (parentId?: number) => {
    if (!newComment.trim()) return;
    
    try {
      await createDiscussion(newComment, parentId);
      setNewComment('');
      setReplyingTo(null);
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const renderDiscussion = (discussion: any, depth = 0) => (
    <div key={discussion.id} className={`${depth > 0 ? 'ml-8' : ''}`}>
      <Card className="mb-4">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <Avatar
              src={discussion.author.profilePicture}
              alt={discussion.author.username}
              size="sm"
            />
            <div>
              <p className="font-medium">{discussion.author.username}</p>
              <p className="text-sm text-neutral-600">
                {formatDate(discussion.createdAt)}
              </p>
            </div>
          </div>
          
          <div className="mt-3">{discussion.content}</div>

          {user && (
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(discussion.id)}
              >
                Reply
              </Button>
            </div>
          )}

          {replyingTo === discussion.id && (
            <div className="mt-3 space-y-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your reply..."
                rows={3}
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleSubmit(discussion.id)}
                  disabled={isLoading}
                >
                  Post Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {discussion.replies?.map((reply: any) => 
        renderDiscussion(reply, depth + 1)
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {user && (
        <div className="space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Start a discussion..."
            rows={3}
          />
          <Button
            onClick={() => handleSubmit()}
            disabled={isLoading}
          >
            Post Discussion
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {discussions.map((discussion) => renderDiscussion(discussion))}
      </div>
    </div>
  );
};