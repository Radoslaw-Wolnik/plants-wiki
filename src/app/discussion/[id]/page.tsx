// src/pages/discussions/[id]/page.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import DiscussionThread from '../../components/DiscussionThread';
import CommentForm from '../../components/CommentForm';

const DiscussionForumPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    if (id) {
      fetchDiscussions();
    }
  }, [id]);

  const fetchDiscussions = async () => {
    const response = await fetch(`/api/discussions?articleId=${id}`);
    const data = await response.json();
    setDiscussions(data);
  };

  const handleNewComment = async (content) => {
    const response = await fetch('/api/discussions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, articleId: id }),
    });

    if (response.ok) {
      fetchDiscussions();
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Discussions</h1>
      <div className="mb-8">
        <CommentForm onSubmit={handleNewComment} />
      </div>
      <div className="space-y-8">
        {discussions.map((discussion) => (
          <DiscussionThread key={discussion.id} discussion={discussion} />
        ))}
      </div>
    </Layout>
  );
};

export default DiscussionForumPage;