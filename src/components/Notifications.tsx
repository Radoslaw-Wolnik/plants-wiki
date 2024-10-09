// src/components/Notifications.tsx

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Notification {
  id: number;
  type: string;
  content: string;
  createdAt: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (session) {
      fetchNotifications();
    }
  }, [session]);

  const fetchNotifications = async () => {
    const response = await fetch('/api/users/notifications');
    const data = await response.json();
    setNotifications(data);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    const response = await fetch(`/api/users/notifications/${notificationId}/read`, { method: 'PUT' });
    if (response.ok) {
      fetchNotifications();
    }
  };

  const handleDelete = async (notificationId: number) => {
    const response = await fetch(`/api/users/notifications/${notificationId}`, { method: 'DELETE' });
    if (response.ok) {
      fetchNotifications();
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li key={notification.id} className={`p-4 rounded-lg ${notification.read ? 'bg-gray-100' : 'bg-blue-100'}`}>
              <p className="mb-2">{notification.content}</p>
              <div className="flex justify-between text-sm">
                <span>{new Date(notification.createdAt).toLocaleString()}</span>
                <div>
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;