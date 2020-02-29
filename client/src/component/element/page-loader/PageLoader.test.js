import React from 'react';
import { render } from '@testing-library/react';
import PageLoader from './PageLoader';

test('Component className is PageLoader', () => {
	const { container } = render(<PageLoader />);
	expect(container.firstChild).toHaveClass('PageLoader');
});

