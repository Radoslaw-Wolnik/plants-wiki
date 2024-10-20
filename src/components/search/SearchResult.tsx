// src/components/search/SearchResults.tsx

import React from 'react';
import Link from 'next/link';
import { Card } from '../common';
import { Plant, Article, User } from '@/types/global';

interface SearchResultsProps {
  results: {
    plants: Plant[];
    articles: Article[];
    users: User[];
  };
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <div className="space-y-8">
      <ResultSection title="Plants" items={results.plants} renderItem={renderPlantItem} />
      <ResultSection title="Articles" items={results.articles} renderItem={renderArticleItem} />
      <ResultSection title="Users" items={results.users} renderItem={renderUserItem} />
    </div>
  );
};

interface ResultSectionProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function ResultSection<T>({ title, items, renderItem }: ResultSectionProps<T>) {
  return (
    <Card>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index}>{renderItem(item)}</li>
          ))}
        </ul>
      ) : (
        <p>No {title.toLowerCase()} found.</p>
      )}
    </Card>
  );
}

const renderPlantItem = (plant: Plant) => (
  <Link href={`/plants/${plant.id}`} className="text-blue-600 hover:underline">
    {plant.name} ({plant.scientificName})
  </Link>
);

const renderArticleItem = (article: Article) => (
  <Link href={`/articles/${article.id}`} className="text-blue-600 hover:underline">
    {article.title}
  </Link>
);

const renderUserItem = (user: User) => (
  <Link href={`/users/${user.id}`} className="text-blue-600 hover:underline">
    {user.username}
  </Link>
);

export default SearchResults;