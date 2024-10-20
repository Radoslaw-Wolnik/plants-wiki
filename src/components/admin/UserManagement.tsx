// src/components/admin/UserManagement.tsx

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, Input, Button, Table } from '../common';
import { User } from '@/types/global';

const UserManagement: React.FC = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    const response = await fetch('/api/admin/users');
    const data = await response.json();
    setUsers(data);
  };

  const handleBanUser = async (userId: number) => {
    const response = await fetch(`/api/admin/users/${userId}/ban`, { method: 'POST' });
    if (response.ok) {
      fetchUsers();
    }
  };

  const handleUnbanUser = async (userId: number) => {
    const response = await fetch(`/api/admin/users/${userId}/unban`, { method: 'POST' });
    if (response.ok) {
      fetchUsers();
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'Username', accessor: 'username' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { 
      header: 'Status', 
      accessor: 'isBanned',
      cell: (value: boolean) => value ? 'Banned' : 'Active'
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value: number, row: User) => (
        <Button
          variant={row.isBanned ? 'primary' : 'danger'}
          size="small"
          onClick={() => row.isBanned ? handleUnbanUser(value) : handleBanUser(value)}
        >
          {row.isBanned ? 'Unban' : 'Ban'}
        </Button>
      )
    }
  ];

  return (
    <Card>
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      <Input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Table columns={columns} data={filteredUsers} />
    </Card>
  );
};

export default UserManagement;