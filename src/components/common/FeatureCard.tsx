// src/components/common/FeatureCard.tsx
import { ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  children: ReactNode;
}

export default function FeatureCard({ title, children }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}