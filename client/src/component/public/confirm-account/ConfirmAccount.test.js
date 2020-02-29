import React from 'react';
import { render } from '@testing-library/react';
import ConfirmAccount from './ConfirmAccount';

test('Component className is ConfirmAccount', () => {
	const { container } = render(<ConfirmAccount />);
	expect(container.firstChild).toHaveClass('ConfirmAccount');
});

