import React from 'react';
import { render } from '@testing-library/react';
import AccountConfirmed from './AccountConfirmed';

test('Component className is AccountConfirmed', () => {
	const { container } = render(<AccountConfirmed />);
	expect(container.firstChild).toHaveClass('AccountConfirmed');
});

