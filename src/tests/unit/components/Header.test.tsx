import React from 'react';
import { render, screen } from '@/tests/utils/testUtils';
import Header from '@/components/Header';

describe('Header', () => {
  it('renders logo and navigation links', () => {
    render(<Header />);
    
    expect(screen.getByAltText('Plant Wiki Logo')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Plants')).toBeInTheDocument();
    expect(screen.getByText('Articles')).toBeInTheDocument();
  });
});