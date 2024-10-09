// src/components/layout/Navbar.tsx

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '../common';

const Navbar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-green-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Plant Wiki
        </Link>
        <div className="space-x-4">
          <NavLink href="/plants">Plants</NavLink>
          <NavLink href="/articles">Articles</NavLink>
          {session ? (
            <>
              <NavLink href="/profile">Profile</NavLink>
              <NavLink href="/library">My Library</NavLink>
              <Button variant="secondary" size="small" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <NavLink href="/signin">Sign In</NavLink>
              <NavLink href="/signup">Sign Up</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Link href={href} className="hover:text-green-200">
    {children}
  </Link>
);

export default Navbar;