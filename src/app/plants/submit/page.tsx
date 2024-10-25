// src/app/plants/submit/page.tsx
'use client';

import React, { useState } from 'react';
import { Tabs } from '@/components/ui';
import { PlantSubmissionForm } from '@/components/features/plants/PlantSubmissionForm';
import PixelArtEditor from '@/components/features/plants/PixelArtEditor';
import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';

export default function PlantSubmissionPage() {
  const { user } = useAuth();
  const [iconData, setIconData] = useState<string>('');
  const [plantImage, setPlantImage] = useState<string>('');

  // Only allow authenticated users
  if (!user) {
    redirect('/auth/signin');
  }

  const handleIconCreate = (iconData: string) => {
    setIconData(iconData);
  };

  const handleImageUpload = (imageUrl: string) => {
    setPlantImage(imageUrl);
  };

  const tabs = [
    {
      id: 'info',
      label: 'Plant Information',
      content: (
        <PlantSubmissionForm
          onIconCreated={handleIconCreate}
          onImageUploaded={handleImageUpload}
        />
      ),
    },
    {
      id: 'icon',
      label: 'Create Plant Icon',
      content: (
        <PixelArtEditor
          onSave={(imageData) => handleIconCreate(imageData)}
          libraryImages={[]}
        />
      ),
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Submit New Plant</h1>
      <Tabs tabs={tabs} />
    </div>
  );
}