// File: src/components/layout/Footer.tsx

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <p>&copy; 2023 Plant Wiki. All rights reserved.</p>
          <div className="space-x-4">
            <a href="/privacy" className="hover:text-primary-300">Privacy Policy</a>
            <a href="/terms" className="hover:text-primary-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;