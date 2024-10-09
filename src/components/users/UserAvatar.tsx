// src/components/users/UserAvatar.tsx

import React from 'react';
import Image from 'next/image';

interface UserAvatarProps {
  src: string;
  alt: string;
  size?: number;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ src, alt, size = 40 }) => {
  return (
    <div className={`rounded-full overflow-hidden`} style={{ width: size, height: size }}>
      <Image
        src={src || '/default-avatar.png'}
        alt={alt}
        width={size}
        height={size}
        className="object-cover"
      />
    </div>
  );
};

export default UserAvatar;