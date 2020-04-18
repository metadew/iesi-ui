import React from 'react';
import ShowUntilEnvConfigKnown from '../ShowUntilEnvConfigKnown';
import ThemeProvider from '../ThemeProvider';
import FlashMessages from '../FlashMessages';
import AppHeader from '../AppHeader';
import AppBody from '../AppBody';

export default function AppTemplate() {
    return (
        <ShowUntilEnvConfigKnown>
            <ThemeProvider>
                <FlashMessages />
                <AppHeader />
                <AppBody />
            </ThemeProvider>
        </ShowUntilEnvConfigKnown>
    );
}
