import React from 'react';
import { render } from '@testing-library/react';
import Home from './Home';

test('Component className is Home', () => {
	const { container } = render(<Home />);
	expect(container.firstChild).toHaveClass('Home');
});

