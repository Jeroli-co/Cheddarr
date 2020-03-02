import React from 'react';
import { render } from '@testing-library/react';
import ResetPasswordForm from './ResetPasswordForm';

test('Component className is ResetPasswordForm', () => {
	const { container } = render(<ResetPasswordForm />);
	expect(container.firstChild).toHaveClass('ResetPasswordForm');
});

