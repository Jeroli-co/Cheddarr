import React from 'react';
import { render } from '@testing-library/react';
import SignUpButton from './SignUpButton';

test('Component className is SignUpButton', () => {
	const { container } = render(<SignUpButton />);
	expect(container.firstChild).toHaveClass('SignUpButton');
});

