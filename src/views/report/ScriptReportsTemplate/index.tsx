import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import RouteLink from 'views/common/navigation/RouteLink';
import renderChildComponentRoutes from 'views/common/navigation/renderChildComponentRoutes';
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
                        <RouteLink to={ROUTE_KEYS.R_REPORT_DETAIL} payload={{ reportId: 2503 }}>detail</RouteLink>
                    </li>
                </ul>
            </nav>
            <div>
                {renderChildComponentRoutes({ path })}
            </div>
        </div>
    );
}

export default ScriptReportsTemplate;
