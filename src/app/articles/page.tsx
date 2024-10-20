// File: src/app/articles/page.tsx

import React from 'react';
import Link from 'next/link';

async function getArticles() {
  // In a real app, this would be an API call
  return [
    { id: 1, title: 'Top 10 Houseplants for Beginners', excerpt: 'If you\'re new to plant parenthood...' },
    { id: 2, title: 'Understanding Plant Light Requirements', excerpt: 'Light is one of the most crucial factors...' },
    // ... more articles
  ];
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Plant Articles</h1>
      <div className="space-y-6">
        {articles.map((article) => (
          <div key={article.id} className="border p-4 rounded-lg">
            <Link href={`/articles/${article.id}`} className="text-xl font-semibold hover:text-primary-600">
              {article.title}
            </Link>
            <p className="mt-2 text-gray-600">{article.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}