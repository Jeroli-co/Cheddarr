import React from 'react';
import { render } from '@testing-library/react';
import UserProfile from './UserProfile';

test('Component className is UserProfile', () => {
	const { container } = render(<UserProfile />);
	expect(container.firstChild).toHaveClass('UserProfile');
});

