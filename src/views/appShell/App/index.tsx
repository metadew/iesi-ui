import React from 'react';
import { Router } from '@reach/router';
import { Typography } from '@material-ui/core';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { ROUTES } from 'views/routes';
import configuredStore from 'state/setup/configuredStore';
import { StoreProvider } from 'views/observe';
import initApp from 'state/initApp';
import ThemeProvider from '../ThemeProvider';
import I18nAware from '../I18nAware';
import ShowUntilEnvConfigKnown from '../ShowUntilEnvConfigKnown';

import Nav from './Nav';

// Route Components
import ReactStartPage from './ReactStartPage';
import Home from '../../home';
import Dashboard from '../../dashboard';
import About from '../../about';
import AboutHome from '../../about/AboutHome';
import Team from '../../about/Team';
import TeamOverview from '../../about/Team/TeamOverview';
import TeamMember from '../../about/Team/Member';
import NotFound from '../NotFound';

export default function App() {
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

initApp();

function DummyExample() {
    return (
        <div>
            <Typography variant="h1">
                <Translate msg="app_shell.header.title" />
            </Typography>
            <div>
                <Nav />
            </div>
            <div>
                <Router>
                    <Home path="/" />
                    <Dashboard path={ROUTES.DASHBOARD} />
                    <About path={ROUTES.ABOUT}>
                        <AboutHome path="/" />
                        <Team path={ROUTES.ABOUT_TEAM}>
                            <TeamOverview path="/" />
                            <TeamMember path="/:memberId" />
                        </Team>
                    </About>
                    <ReactStartPage path={ROUTES.REACT_START_PAGE} />
                    <NotFound default />
                </Router>
            </div>
        </div>
    );
}
