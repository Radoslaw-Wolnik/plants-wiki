// src/components/users/UserProfile.tsx

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, Button, Form } from '../common';
import { User } from '../../types';

interface UserProfileProps {
  user: User;
  isOwnProfile: boolean;
  onUpdateProfile?: (updatedData: Partial<User>) => Promise<void>;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, isOwnProfile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    if (onUpdateProfile) {
      await onUpdateProfile(editedUser);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleChange = (name: string, value: string) => {
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const fields = [
    { name: 'username', label: 'Username', type: 'text' as const, required: true },
    { name: 'email', label: 'Email', type: 'email' as const, required: true },
  ];

  return (
    <Card>
      <div className="flex items-center mb-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden mr-4">
          <Image
            src={user.profilePicture || '/default-avatar.png'}
            alt={user.username}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div>
          {isEditing ? (
            <Form
              fields={fields}
              onSubmit={handleSave}
              submitButtonText="Save"
              values={editedUser}
              onChange={handleChange}
            />
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-1">{user.username}</h2>
              <p className="text-gray-600">Member since {new Date(user.createdAt).getFullYear()}</p>
              <p className="text-gray-600 capitalize">{user.role.toLowerCase()}</p>
            </>
          )}
        </div>
      </div>
      {isOwnProfile && (
        <div className="mb-4">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="mr-2">Save</Button>
              <Button onClick={handleCancel} variant="secondary">Cancel</Button>
            </>
          ) : (
            <Button onClick={handleEdit}>Edit Profile</Button>
          )}
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Stats</h3>
        <p>Posts: {user._count.posts}</p>
        <p>Friends: {user._count.friends}</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Recent Posts</h3>
        <div className="space-y-4">
          {user.posts.map(post => (
            <Card key={post.id} className="p-4">
              <p>{post.content}</p>
              <p className="text-sm text-gray-600 mt-2">
                Posted on {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default UserProfile;