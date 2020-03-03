import React from 'react';
import { render } from '@testing-library/react';
import InitResetPasswordModal from './InitResetPasswordModal';

test('Component className is InitResetPasswordModal', () => {
	const { container } = render(<InitResetPasswordModal />);
	expect(container.firstChild).toHaveClass('InitResetPasswordModal');
});

