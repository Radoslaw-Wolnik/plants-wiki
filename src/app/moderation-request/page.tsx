// src/app/moderator-request/page.tsx

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../components/Layout';

interface UserStats {
  approvedChanges: number;
  registrationDate: string;
  plantCount: number;
}

const ModeratorRequestPage: React.FC = () => {
  const { data: session } = useSession();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchUserStats();
      fetchRequestStatus();
    }
  }, [session]);

  const fetchUserStats = async () => {
    const response = await fetch('/api/users/stats');
    const data = await response.json();
    setUserStats(data);
  };

  const fetchRequestStatus = async () => {
    const response = await fetch('/api/moderator-requests/status');
    const data = await response.json();
    setRequestStatus(data.status);
  };

  const handleModeratorRequest = async () => {
    const response = await fetch('/api/moderator-requests', { method: 'POST' });
    if (response.ok) {
      setRequestStatus('PENDING');
    }
  };

  const isEligible = userStats && 
    userStats.approvedChanges >= 5 && 
    new Date(userStats.registrationDate) <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) &&
    userStats.plantCount >= 3;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Request Moderator Status</h1>
      {userStats ? (
        <div className="space-y-4">
          <p>Approved changes: {userStats.approvedChanges}</p>
          <p>Registration date: {new Date(userStats.registrationDate).toLocaleDateString()}</p>
          <p>Plants in library: {userStats.plantCount}</p>
          {isEligible ? (
            requestStatus === 'PENDING' ? (
              <p className="text-yellow-600">Your moderator request is pending approval.</p>
            ) : (
              <button
                onClick={handleModeratorRequest}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Request Moderator Status
              </button>
            )
          ) : (
            <p className="text-red-600">You are not yet eligible to request moderator status.</p>
          )}
        </div>
      ) : (
        <p>Loading user stats...</p>
      )}
    </Layout>
  );
};

export default ModeratorRequestPage;