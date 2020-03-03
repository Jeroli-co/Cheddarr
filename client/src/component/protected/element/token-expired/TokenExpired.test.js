import React from 'react';
import { render } from '@testing-library/react';
import TokenExpired from './TokenExpired';

test('Component className is TokenExpired', () => {
	const { container } = render(<TokenExpired />);
	expect(container.firstChild).toHaveClass('TokenExpired');
});

