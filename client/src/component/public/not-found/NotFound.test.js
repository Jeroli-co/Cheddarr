import React from 'react';
import { render } from '@testing-library/react';
import NotFound from './NotFound';

test('Component className is NotFound', () => {
	const { container } = render(<NotFound />);
	expect(container.firstChild).toHaveClass('NotFound');
});

