import React from 'react';
import { Box, createMuiTheme, ThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';
import configuredStore from 'state/setup/configuredStore';
import 'views/routeConfigs';
import 'state/onRouteConfig';
import initApp from 'state/initApp';
import { StoreProvider } from 'views/observe';
import ErrorBoundary from 'views/common/error/ErrorBoundary';
import I18nAware from '../I18nAware';
import { UserSessionProvider } from '../AppSignIn/contexts/UserSessionContext';
import AppTemplate from '../AppTemplate';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#1E90FF',
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
                                    <AppTemplate />
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
