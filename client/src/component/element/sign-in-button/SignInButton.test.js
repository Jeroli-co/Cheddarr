import React from 'react';
import { render } from '@testing-library/react';
import SignInButton from './SignInButton';

test('Component className is SignInButton', () => {
	const { container } = render(<SignInButton />);
	expect(container.firstChild).toHaveClass('SignInButton');
});

