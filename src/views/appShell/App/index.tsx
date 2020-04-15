import React from 'react';
import { Typography } from '@material-ui/core';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { SnackbarProvider } from 'notistack';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
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
import PermissionRoute from './PermissionRoute';
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
                        const { path, exact, component, requiredAccessLevels } = route;
                        return requiredAccessLevels ? (
                            <PermissionRoute
                                key={routeKey}
                                path={path}
                                component={component}
                                exact={exact}
                                requiredAccessLevels={requiredAccessLevels}
                            />
                        ) : (
                            <Route key={routeKey} path={path} component={component} exact={exact} />
                        );
                    })}
                </Switch>
            </div>
        </>
    );
}
