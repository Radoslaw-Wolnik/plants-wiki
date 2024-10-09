// src/components/DiscussionThread.tsx

import React from 'react';
import { formatDate } from '../utils/dateUtils';

interface DiscussionThreadProps {
  discussion: {
    id: number;
    content: string;
    createdAt: string;
    author: {
      username: string;
    };
    replies: Array<{
      id: number;
      content: string;
      createdAt: string;
      author: {
        username: string;
      };
    }>;
  };
}

const DiscussionThread: React.FC<DiscussionThreadProps> = ({ discussion }) => (
  <div className="bg-white rounded-lg shadow-md p-4">
    <div className="mb-4">
      <p className="text-lg">{discussion.content}</p>
      <p className="text-sm text-gray-600 mt-2">
        Posted by {discussion.author.username} on {formatDate(discussion.createdAt)}
      </p>
    </div>
    {discussion.replies.length > 0 && (
      <div className="ml-8 space-y-4">
        {discussion.replies.map((reply) => (
          <div key={reply.id} className="bg-gray-100 rounded-lg p-3">
            <p>{reply.content}</p>
            <p className="text-sm text-gray-600 mt-2">
              Reply by {reply.author.username} on {formatDate(reply.createdAt)}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default DiscussionThread;