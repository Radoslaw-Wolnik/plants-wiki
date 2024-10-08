// File: src/app/page.tsx

import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Plant Wiki</h1>
      <p className="text-xl mb-8">Your go-to resource for all things plants!</p>
      <div className="space-x-4">
        <Link href="/plants" className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded">
          Explore Plants
        </Link>
        <Link href="/auth/signup" className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-2 px-4 rounded">
          Join Our Community
        </Link>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          title="Extensive Plant Database"
          description="Access information on thousands of plant species."
        />
        <FeatureCard
          title="Community Driven"
          description="Contribute your knowledge and learn from others."
        />
        <FeatureCard
          title="Personal Plant Management"
          description="Keep track of your own plants and their care routines."
        />
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p>{description}</p>
  </div>
);

export default Home;