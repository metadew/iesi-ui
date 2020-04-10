import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import NavLink from 'views/common/NavLink';
import ReportDetail from '../Detail';

function Overview() {
    const { path, url } = useRouteMatch();

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
                    <Route path={path} exact>
                        <Typography variant="h2">Executions list</Typography>
                    </Route>
                    <Route path={`${path}/:detailId`}>
                        <ReportDetail />
                    </Route>
                </Switch>
            </div>
        </div>
    );
}

export default Overview;
