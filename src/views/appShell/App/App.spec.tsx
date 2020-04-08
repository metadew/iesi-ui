import React from 'react';
import { render } from '@testing-library/react';
import App from '.';
import setMockState from '../../../utils/test/setMockState';

describe('App component:', () => {
    it('renders properly', () => {
        setMockState({});

        const { getByText } = render(<App />);

        const linkElement = getByText(/IESI UI/i);
        expect(linkElement).toBeInTheDocument();
    });
});
