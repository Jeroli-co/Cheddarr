import React from 'react';
import { render } from '@testing-library/react';
import EmailInputModal from './EmailInputModal';

test('Component className is EmailInputModal', () => {
	const { container } = render(<EmailInputModal />);
	expect(container.firstChild).toHaveClass('EmailInputModal');
});

