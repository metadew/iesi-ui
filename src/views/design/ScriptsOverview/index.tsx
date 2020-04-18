import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import RouteLink from 'views/common/navigation/RouteLink';
import { getRoutePath, ROUTE_KEYS } from 'views/routes';
import ScriptDetail from '../ScriptDetail';

function ScriptsOverview() {
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <RouteLink to={ROUTE_KEYS.R_SCRIPTS} exact>Overview</RouteLink>
                    </li>
                    <li>
                        <RouteLink to={ROUTE_KEYS.R_SCRIPT_DETAIL} payload={{ scriptId: 'qid68ms' }}>detail</RouteLink>
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
