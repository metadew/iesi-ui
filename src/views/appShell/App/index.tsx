import React from 'react';
import { Box } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';
import configuredStore from 'state/setup/configuredStore';
import initApp from 'state/initApp';
import 'views/routeConfigs';
import { StoreProvider } from 'views/observe';
import ErrorBoundary from 'views/common/error/ErrorBoundary';
import './app.scss';
import I18nAware from '../I18nAware';
import AppTemplate from '../AppTemplate';

function App() {
    return (
        <Box height="100%">
            <StoreProvider value={configuredStore}>
                <Router>
                    <I18nAware>
                        <ErrorBoundary>
                            <AppTemplate />
                        </ErrorBoundary>
                    </I18nAware>
                </Router>
            </StoreProvider>
        </Box>
    );
}

export default App;

initApp();
