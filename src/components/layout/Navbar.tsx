// src/components/layout/Navbar.tsx

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Navbar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-green-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Plant Wiki
        </Link>
        <div className="space-x-4">
          <Link href="/plants" className="hover:text-green-200">Plants</Link>
          <Link href="/articles" className="hover:text-green-200">Articles</Link>
          {session ? (
            <>
              <Link href="/profile" className="hover:text-green-200">Profile</Link>
              <Link href="/library" className="hover:text-green-200">My Library</Link>
              <button onClick={() => signOut()} className="hover:text-green-200">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/signin" className="hover:text-green-200">Sign In</Link>
              <Link href="/signup" className="hover:text-green-200">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;