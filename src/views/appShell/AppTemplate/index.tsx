import React from 'react';
import ShowUntilEnvConfigKnown from '../ShowUntilEnvConfigKnown';
import ThemeProvider from '../ThemeProvider';
import FlashMessages from '../FlashMessages';
import AppHeader from '../AppHeader';
import AppBody from '../AppBody';
import routeListener from '../RouteListener';

export default function AppTemplate() {
    routeListener();

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
