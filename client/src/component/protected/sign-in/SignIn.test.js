import React from 'react';
import { render } from '@testing-library/react';
import SignIn from './SignIn';

test('Component className is SignIn', () => {
	const { container } = render(<SignIn />);
	expect(container.firstChild).toHaveClass('SignIn');
});

