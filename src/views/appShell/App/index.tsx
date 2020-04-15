import React from 'react';
import { Typography } from '@material-ui/core';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import ROUTE_KEYS from 'routeKeys';
import configuredStore from 'state/setup/configuredStore';
import initApp from 'state/initApp';
import { StoreProvider } from 'views/observe';
import ROUTES from 'views/routes';
import ThemeProvider from '../ThemeProvider';
import I18nAware from '../I18nAware';
import ShowUntilEnvConfigKnown from '../ShowUntilEnvConfigKnown';
import './app.scss';
import MainNav from '../MainNav';
import FlashMessageManager from '../FlashMessageManager';
import Route from '../../common/navigation/Route';
import MockPermissions from './MockPermissions';

function App() {
    return (
        <div className="App">
            <StoreProvider value={configuredStore}>
                <Router>
                    <I18nAware>
                        <ShowUntilEnvConfigKnown>
                            <ThemeProvider>
                                <SnackbarProvider
                                    maxSnack={3}
                                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                                >
                                    <FlashMessageManager />
                                </SnackbarProvider>
                                <DummyExample />
                            </ThemeProvider>
                        </ShowUntilEnvConfigKnown>
                    </I18nAware>
                </Router>
            </StoreProvider>
        </div>
    );
}

export default App;

initApp();

function DummyExample() {
    return (
        <>
            <MockPermissions />
            <Typography variant="h1">
                <Translate msg="app_shell.header.title" raw />
            </Typography>
            <MainNav />
            <div>
                <Switch>
                    {Object.keys(ROUTES).map((routeKey) => {
                        const route = ROUTES[routeKey];
                        return (
                            <Route
                                key={routeKey}
                                routeKey={routeKey as ROUTE_KEYS}
                                path={route.path}
                                exact={route.exact}
                            />
                        );
                    })}
                </Switch>
            </div>
        </>
    );
}
