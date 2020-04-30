import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import setMockState from 'utils/test/setMockState';
import App from '.';

describe('App component:', () => {
    it('renders properly', () => {
        setMockState();

        const { getByTitle } = render(<App />);

        const linkElement = getByTitle(/app_shell.header.title/i);
        expect(linkElement).toBeInTheDocument();
    });
});
