import React from 'react';
import { Typography } from '@material-ui/core';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
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

function App() {
    return (
        <div className="App">
            <StoreProvider value={configuredStore}>
                <I18nAware>
                    <ShowUntilEnvConfigKnown>
                        <ThemeProvider>
                            <DummyExample />
                        </ThemeProvider>
                    </ShowUntilEnvConfigKnown>
                </I18nAware>
            </StoreProvider>
        </div>
    );
}

export default App;

initApp();

function DummyExample() {
    return (
        <Router>
            <Typography variant="h1">
                <Translate msg="app_shell.header.title" raw />
            </Typography>
            <MainNav />
            <div>
                <Switch>
                    <Route path={ROUTES.R_HOME.path} exact component={ROUTES.R_HOME.component} />
                    <Route path={ROUTES.R_DESIGN.path} component={ROUTES.R_DESIGN.component} />
                    <Route path={ROUTES.R_REPORT.path} component={ROUTES.R_REPORT.component} />
                    <Route path="*" component={ROUTES.R_NOT_FOUND.component} />
                </Switch>
            </div>
        </Router>
    );
}
