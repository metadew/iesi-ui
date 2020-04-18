import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { getRoutePath, ROUTE_KEYS } from 'views/routes';
import NavLink from 'views/common/navigation/NavLink';
import ScriptReportDetail from '../ScriptReportDetail';

function ScriptReportsOverview() {
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
                    <Route path={getRoutePath({ routeKey: ROUTE_KEYS.R_REPORT_DETAIL })}>
                        <ScriptReportDetail />
                    </Route>
                    <Route path={getRoutePath({ routeKey: ROUTE_KEYS.R_REPORTS })}>
                        <Typography variant="h2">Executions list</Typography>
                    </Route>
                </Switch>
            </div>
        </div>
    );
}

export default ScriptReportsOverview;
