import React from 'react';
import { render } from '@testing-library/react';
import AuthorizeFacebook from './AuthorizeFacebook';

test('Component className is AuthorizeFacebook', () => {
	const { container } = render(<AuthorizeFacebook />);
	expect(container.firstChild).toHaveClass('AuthorizeFacebook');
});

