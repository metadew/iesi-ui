import React from 'react';
import { Router } from '@reach/router';
import { Typography } from '@material-ui/core';
import { ROUTES } from '../../routes';

import Nav from './Nav';

// Route Components
import Home from '../../home';
import Dashboard from '../../dashboard';
import About from '../../about';
import AboutHome from '../../about/AboutHome';
import Team from '../../about/Team';
import TeamOverview from '../../about/Team/TeamOverview';
import TeamMember from '../../about/Team/Member';
import NotFound from '../NotFound';

function App() {
    return (
        <div>
            <Typography variant="h1">IESI UI</Typography>
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
                    <NotFound default />
                </Router>
            </div>
        </div>
    );
}

export default App;
