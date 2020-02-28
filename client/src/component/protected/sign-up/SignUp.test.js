import React from 'react';
import { render } from '@testing-library/react';
import SignUp from './SignUp';

test('Component className is SignUp', () => {
	const { container } = render(<SignUp />);
	expect(container.firstChild).toHaveClass('SignUp');
});

