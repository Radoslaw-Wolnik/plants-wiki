// src/components/ui/avatar.tsx
import React from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt = "Avatar", size = "md", className = "" }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    return (
      <div
        ref={ref}
        className={`
          relative rounded-full overflow-hidden bg-neutral-100
          ${sizeMap[size]} ${className}
        `}
      >
        {src && !imageError ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-neutral-200">
            <User className="h-1/2 w-1/2 text-neutral-500" />
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;