// src/app/admin/dashboard/page.tsx

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import UserManagement from '../../components/UserManagement';

const AdminDashboard: React.FC = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPlants: 0,
    totalArticles: 0,
    flaggedContent: 0,
  });

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchStats();
    }
  }, [session]);

  const fetchStats = async () => {
    const response = await fetch('/api/admin/statistics');
    const data = await response.json();
    setStats(data);
  };

  if (session?.user?.role !== 'ADMIN') {
    return <Layout><div>Access denied. Admin privileges required.</div></Layout>;
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Active Users" value={stats.activeUsers} />
        <StatCard title="Total Plants" value={stats.totalPlants} />
        <StatCard title="Total Articles" value={stats.totalArticles} />
        <StatCard title="Flagged Content" value={stats.flaggedContent} />
      </div>
      <UserManagement />
    </Layout>
  );
};

export default AdminDashboard;