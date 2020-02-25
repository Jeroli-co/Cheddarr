import React from 'react';
import { render } from '@testing-library/react';
import Navbar from './Navbar';

test('Component className is Navbar', () => {
	const { container } = render(<Navbar />);
	expect(container.firstChild).toHaveClass('Navbar');
});

