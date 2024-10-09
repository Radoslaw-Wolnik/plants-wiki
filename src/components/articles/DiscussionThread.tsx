// src/components/articles/DiscussionThread.tsx

import React from 'react';
import { Card } from '../common';
import { formatDate } from '../../utils';

interface Discussion {
  id: number;
  content: string;
  createdAt: string;
  author: {
    username: string;
  };
  replies: Discussion[];
}

interface DiscussionThreadProps {
  discussion: Discussion;
}

const DiscussionThread: React.FC<DiscussionThreadProps> = ({ discussion }) => {
  const renderDiscussion = (disc: Discussion, depth = 0) => (
    <Card key={disc.id} className={`mb-4 ${depth > 0 ? 'ml-8' : ''}`}>
      <p className="text-lg">{disc.content}</p>
      <p className="text-sm text-gray-600 mt-2">
        Posted by {disc.author.username} on {formatDate(disc.createdAt)}
      </p>
      {disc.replies.map(reply => renderDiscussion(reply, depth + 1))}
    </Card>
  );

  return renderDiscussion(discussion);
};

export default DiscussionThread;