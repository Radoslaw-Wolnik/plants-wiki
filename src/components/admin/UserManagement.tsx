// src/components/admin/UserManagement.tsx

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const UserManagement: React.FC = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
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

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Username</th>
            <th className="text-left">Email</th>
            <th className="text-left">Role</th>
            <th className="text-left">Status</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isBanned ? 'Banned' : 'Active'}</td>
              <td>
                {user.isBanned ? (
                  <button
                    onClick={() => handleUnbanUser(user.id)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    Unban
                  </button>
                ) : (
                  <button
                    onClick={() => handleBanUser(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    Ban
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;