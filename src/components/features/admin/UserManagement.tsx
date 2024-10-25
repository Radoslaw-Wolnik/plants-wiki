import React from 'react';
import { Card, Input, Select, Button, Badge } from '@/components/ui';
import { useAdminUsers } from '@/hooks';
import { Search, MoreVertical } from 'lucide-react';
import { formatDate } from '@/utils/general.util';
import { User, UserRole, AdminUser } from '@/types';

interface Filters {
  role: string;
  status: string;
  search: string;
}

export const UserManagement: React.FC = () => {
  const { users, isLoading, filters, setFilters, fetchUsers } = useAdminUsers();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      role: value,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      status: value,
    }));
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">User Management</h2>
          <form onSubmit={handleSearch} className="flex space-x-2">
            <Input
              placeholder="Search users..."
              value={filters.search}
              onChange={handleSearchInput}
              leftIcon={<Search className="h-4 w-4" />}
            />
            <Select
              value={filters.role}
              onChange={handleRoleChange}
              options={[
                { value: '', label: 'All Roles' },
                { value: 'USER', label: 'Users' },
                { value: 'MODERATOR', label: 'Moderators' },
                { value: 'ADMIN', label: 'Admins' },
              ]}
            />
            <Select
              value={filters.status}
              onChange={handleStatusChange}
              options={[
                { value: '', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'banned', label: 'Banned' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
            <Button type="submit">Filter</Button>
          </form>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-16 bg-neutral-100 rounded-lg animate-pulse" />
            ))
          ) : (
            users.map((user: AdminUser) => (
              <div
                key={user.id}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium">{user.username}</h3>
                    <Badge variant={
                      user.role === 'ADMIN' ? 'danger' :
                      user.role === 'MODERATOR' ? 'warning' : 'default'
                    }>
                      {user.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Joined {formatDate(user.createdAt)}
                  </p>
                  <div className="text-sm text-neutral-500 mt-1">
                    {user.stats.plants} plants • {user.stats.articles} articles • {user.stats.reports} reports
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={user.isBanned ? 'success' : 'danger'}
                    size="sm"
                  >
                    {user.isBanned ? 'Unban' : 'Ban'}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};