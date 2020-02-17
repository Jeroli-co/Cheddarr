import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('Component className is App', () => {
  const { container } = render(<App />);
  expect(container.firstChild).toHaveClass('App');
});
