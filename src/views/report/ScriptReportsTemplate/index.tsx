import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import RouteLink from 'views/common/navigation/RouteLink';
import ChildComponentRoutes from 'views/common/navigation/ChildComponentRoutes';
import { ROUTE_KEYS } from 'views/routes';

function ScriptReportsTemplate() {
    const { path } = useRouteMatch();

    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <RouteLink to={ROUTE_KEYS.R_REPORTS} exact>Overview</RouteLink>
                    </li>
                    <li>
                        <RouteLink to={ROUTE_KEYS.R_REPORT_DETAIL} params={{ reportId: 2503 }}>detail</RouteLink>
                    </li>
                </ul>
            </nav>
            <div>
                <ChildComponentRoutes path={path} />
            </div>
        </div>
    );
}

export default ScriptReportsTemplate;
