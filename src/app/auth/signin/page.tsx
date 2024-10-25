// src/app/auth/signin/page.tsx
'use client';

import React, { useState } from 'react';
import { Card, Input, Button, Alert } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail } from 'lucide-react';

export default function SignInPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(credentials);
      router.push('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
          
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({ 
                ...prev, 
                email: e.target.value 
              }))}
              leftIcon={<Mail className="h-4 w-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ 
                ...prev, 
                password: e.target.value 
              }))}
              leftIcon={<Lock className="h-4 w-4" />}
              required
            />

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-neutral-600">
            Don't have an account?{' '}
            <Link 
              href="/auth/signup" 
              className="text-primary-600 hover:text-primary-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
