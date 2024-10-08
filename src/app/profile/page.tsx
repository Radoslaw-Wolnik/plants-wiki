// File: src/app/profile/page.tsx

import React from 'react';
import Image from 'next/image';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PlantCard from '@/components/PlantCard';

async function getUserProfile() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch user profile');
  }
  return res.json();
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Please sign in to view your profile.</div>;
  }

  const user = await getUserProfile();

  return (
    <div>
      <div className="flex items-center mb-6">
        <Image 
          src={user.profilePicture || '/images/default-avatar.png'} 
          alt="Profile Picture" 
          width={100} 
          height={100} 
          className="rounded-full mr-4"
        />
        <div>
          <h1 className="text-3xl font-bold">{user.username}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-4">My Plants</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {user.library?.userPlants.map((userPlant) => (
          <PlantCard 
            key={userPlant.id} 
            name={userPlant.nickname || userPlant.plant.name} 
            image={userPlant.plant.icon} 
            scientificName={userPlant.plant.scientificName}
          />
        ))}
      </div>
    </div>
  );
}