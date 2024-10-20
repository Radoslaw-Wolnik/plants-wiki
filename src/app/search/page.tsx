// src/app/search/page.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import SearchResults from '@/components/SearchResults';

const SearchPage: React.FC = () => {
  const router = useRouter();
  const { q: query } = router.query;
  const [results, setResults] = useState({ plants: [], articles: [], users: [] });

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    const response = await fetch(`/api/search?q=${query}`);
    const data = await response.json();
    setResults(data);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>
      <SearchResults results={results} />
    </Layout>
  );
};

export default SearchPage;