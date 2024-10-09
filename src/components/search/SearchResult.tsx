// src/components/search/SearchResults.tsx

import React from 'react';
import Link from 'next/link';

interface SearchResultsProps {
  results: {
    plants: any[];
    articles: any[];
    users: any[];
  };
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold mb-4">Plants</h2>
        {results.plants.length > 0 ? (
          <ul className="space-y-2">
            {results.plants.map((plant) => (
              <li key={plant.id}>
                <Link href={`/plants/${plant.id}`} className="text-blue-600 hover:underline">
                  {plant.name} ({plant.scientificName})
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No plants found.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Articles</h2>
        {results.articles.length > 0 ? (
          <ul className="space-y-2">
            {results.articles.map((article) => (
              <li key={article.id}>
                <Link href={`/articles/${article.id}`} className="text-blue-600 hover:underline">
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No articles found.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
        {results.users.length > 0 ? (
          <ul className="space-y-2">
            {results.users.map((user) => (
              <li key={user.id}>
                <Link href={`/users/${user.id}`} className="text-blue-600 hover:underline">
                  {user.username}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </section>
    </div>
  );
};

export default SearchResults;