// src/pages/profile/page.tsx

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import UserInfo from '../../components/UserInfo';
import Achievements from '../../components/Achievements';
import Link from 'next/link';

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const response = await fetch('/api/users/profile');
    const data = await response.json();
    setUser(data);
  };

  if (!user) {
    return <Layout><div>Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <UserInfo user={user} />
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">My Plant Collections</h2>
            <div className="space-y-4">
              <Link href="/library" className="block p-4 bg-green-100 hover:bg-green-200 rounded">
                My Plant Library
              </Link>
              <Link href="/wishlist" className="block p-4 bg-blue-100 hover:bg-blue-200 rounded">
                My Wishlist
              </Link>
              <Link href="/graveyard" className="block p-4 bg-gray-100 hover:bg-gray-200 rounded">
                Plant Graveyard
              </Link>
            </div>
          </div>
        </div>
        <div>
          <Achievements achievements={user.achievements} />
        </div>
      </div>
    </Layout>
  );
};

export default UserProfilePage;