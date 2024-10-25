// File: src/app/layout.tsx

import React from 'react';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import '@/styles/globals.css'
import { Toaster } from "@/components/ui/toast";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Plant Wiki',
  description: 'Your go-to resource for all things plants!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
            <Toaster position="top-right" />
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}