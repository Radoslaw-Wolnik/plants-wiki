// src/app/profile/page.tsx
'use client';

import React, { useState } from 'react';
import { Card, Button, Avatar, Input, Tabs, Alert } from '@/components/ui';
import { useProfile } from '@/hooks/useProfile';
import { ImageUpload } from '@/components/ui/image-upload';
import { Pencil, Plant, Book, Heart, Skull } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, stats, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        ...formData,
        profilePicture: profilePicture || undefined,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={<Plant className="h-5 w-5 text-primary-500" />}
            label="Active Plants"
            value={stats.activePlants}
            linkTo="/library"
          />
          <StatCard
            icon={<Book className="h-5 w-5 text-primary-500" />}
            label="Articles"
            value={stats.totalArticles}
            linkTo="/articles"
          />
          <StatCard
            icon={<Heart className="h-5 w-5 text-primary-500" />}
            label="Wishlist Plants"
            value={stats.totalPlants - stats.activePlants}
            linkTo="/wishlist"
          />
          <StatCard
            icon={<Skull className="h-5 w-5 text-neutral-500" />}
            label="Graveyard Plants"
            value={stats.graveyardPlants}
            linkTo="/graveyard"
          />
        </div>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      content: (
        <Card>
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <ImageUpload
                  onUpload={(file) => setProfilePicture(file)}
                  currentImage={user?.profilePicture}
                />
                
                <Input
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    username: e.target.value,
                  }))}
                />

                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    email: e.target.value,
                  }))}
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar
                      src={user?.profilePicture}
                      alt={user?.username || ''}
                      size="lg"
                    />
                    <div>
                      <h2 className="text-xl font-bold">{user?.username}</h2>
                      <p className="text-neutral-600">{user?.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      ),
    },
  ];

  if (!user) {
    return (
      <Alert variant="danger">
        Please sign in to view your profile
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <Tabs tabs={tabs} />
    </div>
  );
}
