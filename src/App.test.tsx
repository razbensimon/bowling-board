import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('name is rendered', () => {
  render(<App />);
  const name = screen.getByText(/Raz Ben Simon/i);
  expect(name).toBeInTheDocument();
});
