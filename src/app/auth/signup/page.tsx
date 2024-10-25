// src/app/auth/signup/page.tsx
'use client';

import React, { useState } from 'react';
import { Card, Input, Button, Alert } from '@/components/ui';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock } from 'lucide-react';
import { useApi } from '@/hooks/useApi';

interface SignUpData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<SignUpData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();
  const { post } = useApi('/auth/register');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await post({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      router.push('/auth/signin?registered=true');
    } catch (err) {
      setError('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            Create Your Account
          </h1>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                username: e.target.value 
              }))}
              leftIcon={<User className="h-4 w-4" />}
              required
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                email: e.target.value 
              }))}
              leftIcon={<Mail className="h-4 w-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                password: e.target.value 
              }))}
              leftIcon={<Lock className="h-4 w-4" />}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                confirmPassword: e.target.value 
              }))}
              leftIcon={<Lock className="h-4 w-4" />}
              required
            />

            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-neutral-600">
            Already have an account?{' '}
            <Link 
              href="/auth/signin" 
              className="text-primary-600 hover:text-primary-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}