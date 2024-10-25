// src/app/articles/page.tsx
'use client';

import React, { useState } from 'react';
import { useArticles } from '@/hooks/useArticles';
import { Card, Input, Button, Pagination } from '@/components/ui';
import { Search, Plus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function ArticlesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { articles, pagination, isLoading } = useArticles({ page, search });
  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Plant Articles</h1>
        {user && (
          <Link href="/articles/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Write Article
            </Button>
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="flex-grow"
            leftIcon={<Search className="h-4 w-4 text-neutral-500" />}
          />
          <Button type="submit">Search</Button>
        </div>
      </form>

      <div className="space-y-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-neutral-200 rounded w-1/2" />
            </Card>
          ))
        ) : (
          articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.id}`}>
              <Card className="p-6 hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                <div className="flex items-center text-sm text-neutral-600 space-x-4">
                  <span>Last updated: {new Date(article.updatedAt).toLocaleDateString()}</span>
                  <span>By: {article.contributors.map(c => c.username).join(', ')}</span>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>

      {pagination && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}