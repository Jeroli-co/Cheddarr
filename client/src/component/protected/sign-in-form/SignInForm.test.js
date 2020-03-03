import React from 'react';
import { render } from '@testing-library/react';
import SignInForm from './SignInForm';

test('Component className is SignInForm', () => {
	const { container } = render(<SignInForm />);
	expect(container.firstChild).toHaveClass('SignInForm');
});

