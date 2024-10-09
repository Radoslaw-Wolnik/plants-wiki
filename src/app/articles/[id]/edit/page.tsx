// src/pages/articles/[id]/edit/page.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import MarkdownEditor from '../../../components/MarkdownEditor';
import { useSession } from 'next-auth/react';

const ArticleEditPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState(null);
  const [content, setContent] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    const response = await fetch(`/api/articles/${id}`);
    const data = await response.json();
    setArticle(data);
    setContent(data.content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/articles/${id}/change-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      router.push(`/articles/${id}`);
    }
  };

  if (!article) {
    return <Layout><div>Loading...</div></Layout>;
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Edit Article: {article.title}</h1>
      <form onSubmit={handleSubmit}>
        <MarkdownEditor value={content} onChange={setContent} />
        <div className="mt-4">
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Submit for Review
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default ArticleEditPage;