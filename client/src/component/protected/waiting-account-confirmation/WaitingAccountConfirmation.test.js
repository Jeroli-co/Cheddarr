import React from 'react';
import { render } from '@testing-library/react';
import WaitingAccountConfirmation from './WaitingAccountConfirmation';

test('Component className is WaitingAccountConfirmation', () => {
	const { container } = render(<WaitingAccountConfirmation />);
	expect(container.firstChild).toHaveClass('WaitingAccountConfirmation');
});

