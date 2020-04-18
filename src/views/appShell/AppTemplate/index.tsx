import React from 'react';
import { Switch } from 'react-router-dom';
import { getAllRoutesAsList } from 'views/routes';
import Route from 'views/common/navigation/Route';
import ShowUntilEnvConfigKnown from '../ShowUntilEnvConfigKnown';
import ThemeProvider from '../ThemeProvider';
import FlashMessages from '../FlashMessages';
import AppHeader from '../AppHeader';

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

function AppBody() {
    return (
        <div>
            <Switch>
                {getAllRoutesAsList().map(({ routeKey, route }) => (
                    <Route
                        key={routeKey}
                        routeKey={routeKey}
                        path={route.path}
                        exact={route.exact}
                    />
                ))}
            </Switch>
        </div>
    );
}
