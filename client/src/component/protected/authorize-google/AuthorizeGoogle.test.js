import React from 'react';
import { render } from '@testing-library/react';
import AuthorizeGoogle from './AuthorizeGoogle';

test('Component className is AuthorizeGoogle', () => {
	const { container } = render(<AuthorizeGoogle />);
	expect(container.firstChild).toHaveClass('AuthorizeGoogle');
});

