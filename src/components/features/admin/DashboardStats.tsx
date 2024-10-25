// src/components/features/admin/DashboardStats.tsx
import React from 'react';
import { Card } from '@/components/ui';
import { Users, BookOpen, Leaf, AlertTriangle, Clock } from 'lucide-react';
import { AdminStats } from '@/types';

interface DashboardStatsProps {
  stats: AdminStats;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statCards = [
    {
      icon: <Users className="h-6 w-6 text-primary-500" />,
      label: 'Total Users',
      value: stats.totalUsers,
      subtext: `${stats.newUsersToday} new today`,
    },
    {
      icon: <Leaf className="h-6 w-6 text-success-500" />,
      label: 'Total Plants',
      value: stats.totalPlants,
      subtext: `${stats.pendingVerifications} pending verification`,
    },
    {
      icon: <BookOpen className="h-6 w-6 text-info-500" />,
      label: 'Total Articles',
      value: stats.totalArticles,
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-warning-500" />,
      label: 'Reported Content',
      value: stats.reportedContent,
    },
    {
      icon: <Clock className="h-6 w-6 text-danger-500" />,
      label: 'Moderation Queue',
      value: stats.moderationQueue,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {stat.icon}
                <div>
                  <p className="text-sm text-neutral-600">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  {stat.subtext && (
                    <p className="text-sm text-neutral-500">{stat.subtext}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};