import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import NavLink from 'views/common/navigation/NavLink';
import { getRoutePath, ROUTE_KEYS } from 'views/routes';
import ScriptDetail from '../ScriptDetail';

function ScriptsOverview() {
    const { url } = useRouteMatch();

    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <NavLink to={url} exact>Overview</NavLink>
                    </li>
                    <li>
                        <NavLink to={`${url}/123`}>detail</NavLink>
                    </li>
                </ul>
            </nav>
            <div>
                <Switch>
                    <Route path={getRoutePath({ routeKey: ROUTE_KEYS.R_SCRIPT_DETAIL })}>
                        <ScriptDetail />
                    </Route>
                    <Route path={getRoutePath({ routeKey: ROUTE_KEYS.R_SCRIPTS })}>
                        <Typography variant="h2">Scripts list</Typography>
                    </Route>
                </Switch>
            </div>
        </div>
    );
}

export default ScriptsOverview;
