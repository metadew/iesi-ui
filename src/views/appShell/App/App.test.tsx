import React from 'react';
import { render } from '@testing-library/react';
import App from '.';

test('renders properly', () => {
    const { getByText } = render(<App />);
    const linkElement = getByText(/IESI UI/i);
    expect(linkElement).toBeInTheDocument();
});
