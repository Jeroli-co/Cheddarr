import React from 'react';
import { render } from '@testing-library/react';
import AlreadyConfirmed from './AccountConfirmation';

test('Component className is AccountConfirmation', () => {
	const { container } = render(<AlreadyConfirmed />);
	expect(container.firstChild).toHaveClass('AlreadyConfirmed');
});

