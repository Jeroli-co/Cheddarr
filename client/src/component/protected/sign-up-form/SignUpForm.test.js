import React from 'react';
import { render } from '@testing-library/react';
import SignUpForm from './SignUpForm';

test('Component className is SignUpForm', () => {
	const { container } = render(<SignUpForm />);
	expect(container.firstChild).toHaveClass('SignUpForm');
});

