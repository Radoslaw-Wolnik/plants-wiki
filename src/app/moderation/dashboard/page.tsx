// src/pages/moderation/dashboard/page.tsx

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import ChangeRequestList from '../../components/ChangeRequestList';
import FlaggedContentList from '../../components/FlaggedContentList';
import { useSession } from 'next-auth/react';

const ModerationDashboard: React.FC = () => {
  const [changeRequests, setChangeRequests] = useState([]);
  const [flaggedContent, setFlaggedContent] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.role === 'MODERATOR' || session?.user?.role === 'ADMIN') {
      fetchChangeRequests();
      fetchFlaggedContent();
    }
  }, [session]);

  const fetchChangeRequests = async () => {
    const response = await fetch('/api/moderation/change-requests');
    const data = await response.json();
    setChangeRequests(data);
  };

  const fetchFlaggedContent = async () => {
    const response = await fetch('/api/moderation/flags');
    const data = await response.json();
    setFlaggedContent(data);
  };

  if (session?.user?.role !== 'MODERATOR' && session?.user?.role !== 'ADMIN') {
    return <Layout><div>Access denied. You must be a moderator or admin to view this page.</div></Layout>;
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Moderation Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Pending Change Requests</h2>
          <ChangeRequestList changeRequests={changeRequests} onUpdate={fetchChangeRequests} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Flagged Content</h2>
          <FlaggedContentList flaggedContent={flaggedContent} onUpdate={fetchFlaggedContent} />
        </div>
      </div>
    </Layout>
  );
};

export default ModerationDashboard;