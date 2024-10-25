// src/app/admin/dashboard/page.tsx
'use client';

import React, { useEffect } from 'react';
import { DashboardStats } from '@/components/features/admin/DashboardStats';
import { UserManagement } from '@/components/features/admin/UserManagement';
import { RecentActions } from '@/components/features/admin/RecentActions';
import { useAdminDashboard } from '@/hooks/features/admin/useAdminDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Alert } from '@/components/ui';
import { redirect } from 'next/navigation';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { stats, recentActions, refresh } = useAdminDashboard();

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (!user || user.role !== 'ADMIN') {
    return redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="space-y-6">
        <DashboardStats stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UserManagement />
          </div>
          <div>
            <RecentActions actions={recentActions} />
          </div>
        </div>
      </div>
    </div>
  );
}
