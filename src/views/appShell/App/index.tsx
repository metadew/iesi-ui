import React from 'react';
import { Box, createMuiTheme, ThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import configuredStore from 'state/setup/configuredStore';
import 'views/routeConfigs';
import 'state/onRouteConfig';
import initApp from 'state/initApp';
import { StoreProvider } from 'views/observe';
import ErrorBoundary from 'views/common/error/ErrorBoundary';
import I18nAware from '../I18nAware';
import { UserSessionProvider } from '../AppSignIn/contexts/UserSessionContext';
import PrivateRoute from '../AppSignIn/components/PrivateRoute';
import AppTemplate from '../AppTemplate';
import Login from '../AppSignIn/Login';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#c30045',
        },
        secondary: {
            main: '#ffffff',
        },
    },
});

function App() {
    return (
        <UserSessionProvider>
            <ThemeProvider theme={theme}>
                <Box height="100%">
                    <StoreProvider value={configuredStore}>
                        <I18nAware>
                            <ErrorBoundary>
                                <Router>
                                    <Switch>
                                        <Route path="/login" component={Login} />
                                        <PrivateRoute path="/scripts" component={AppTemplate} />
                                    </Switch>
                                </Router>
                            </ErrorBoundary>
                        </I18nAware>
                    </StoreProvider>
                </Box>
            </ThemeProvider>
        </UserSessionProvider>
    );
}

export default App;

initApp();
