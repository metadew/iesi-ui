import React from 'react';
import ShowUntilEnvConfigKnown from '../ShowUntilEnvConfigKnown';
import ThemeProvider from '../ThemeProvider';
import FlashMessages from '../FlashMessages';
import AppHeader from '../AppHeader';
import AppBody from '../AppBody';
import AppFooter from '../AppFooter';

export default function AppTemplate() {
    return (
        <ShowUntilEnvConfigKnown>
            <ThemeProvider>
                <FlashMessages />
                <AppHeader />
                <AppBody />
                <AppFooter />
            </ThemeProvider>
        </ShowUntilEnvConfigKnown>
    );
}
