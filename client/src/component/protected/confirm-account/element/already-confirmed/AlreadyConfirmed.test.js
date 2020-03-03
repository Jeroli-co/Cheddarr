import React from 'react';
import { render } from '@testing-library/react';
import AlreadyConfirmed from './AlreadyConfirmed';

test('Component className is AlreadyConfirmed', () => {
	const { container } = render(<AlreadyConfirmed />);
	expect(container.firstChild).toHaveClass('AlreadyConfirmed');
});

