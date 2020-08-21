import { IRoute } from 'models/router.models';
import { triggerFetchScripts, triggerFetchScriptDetail } from 'state/entities/scripts/triggers';
import {
    triggerFetchExecutionRequestDetail,
} from 'state/entities/executionRequests/triggers';
import { triggerFetchActionTypes } from 'state/entities/constants/triggers';
import { SortType, SortOrder } from 'models/list.models';
import { formatSortQueryParameter } from 'utils/core/string/format';
import { triggerFetchEnvironments } from 'state/entities/environments/triggers';
import { ROUTE_KEYS, registerRoutes } from './routes';
import NotFound from './appShell/NotFound';
import Home from './Home';
import ScriptsTemplate from './design/ScriptsTemplate';
import ScriptsOverview from './design/ScriptsOverview';
import ScriptDetail from './design/ScriptDetail';
import ScriptReportsTemplate from './report/ScriptReportsTemplate';
import ScriptReportsOverview from './report/ScriptReportsOverview';
import ScriptReportDetail from './report/ScriptReportDetail';

const ALL_ROUTES: IRoute<ROUTE_KEYS>[] = [{
    routeKey: ROUTE_KEYS.R_HOME,
    path: '/',
    exact: true,
    component: Home,
}, {
    routeKey: ROUTE_KEYS.R_SCRIPTS,
    path: '/scripts',
    template: ScriptsTemplate,
    component: ScriptsOverview,
    childRoutes: [
        {
            routeKey: ROUTE_KEYS.R_SCRIPT_NEW,
            path: '/new',
            component: ScriptDetail as React.ComponentType<unknown>,
            executeOnRoute: [{
                execute: triggerFetchActionTypes,
            }],
        },
        {
            routeKey: ROUTE_KEYS.R_SCRIPT_DETAIL,
            path: '/:name/:version',
            component: ScriptDetail as React.ComponentType<unknown>,
            executeOnRoute: [{
                // TODO: Fix this typing error so we dont need to cast to () => unknown? Can this be simpler?
                // Maybe pass the routeLocation to the execute so we dont need the executeInputSelector prop?
                execute: triggerFetchScriptDetail as () => unknown,
                executeInputSelector: ({ routeLocation }) => ({
                    name: routeLocation.params.name,
                    version: routeLocation.params.version,
                }),
            }, {
                execute: triggerFetchActionTypes,
            }],
        },
    ],
    executeOnRoute: [{
        execute: () => triggerFetchScripts({
            pagination: {
                page: 1,
            },
            expandResponseWith: {
                scheduling: false, // Default = true
            },
            filter: {
                version: 'latest',
            },
            sort: formatSortQueryParameter({
                name: 'name',
                sortOrder: SortOrder.Ascending,
                sortType: SortType.String,
            }),
        }),
    }],
}, {
    routeKey: ROUTE_KEYS.R_REPORTS,
    path: '/reports',
    template: ScriptReportsTemplate,
    component: ScriptReportsOverview,
    childRoutes: [{
        routeKey: ROUTE_KEYS.R_REPORT_DETAIL,
        path: '/:executionRequestId/:runId?/:processId?',
        component: ScriptReportDetail as React.ComponentType<unknown>,
        executeOnRoute: [{
            // TODO: Fix this typing error so we dont need to cast to () => unknown? Can this be simpler?
            // Maybe pass the routeLocation to the execute so we dont need the executeInputSelector prop?
            execute: triggerFetchExecutionRequestDetail as () => unknown,
            executeInputSelector: ({ routeLocation }) => ({
                id: routeLocation.params.executionRequestId,
            }),
        }],
    }],
    executeOnRoute: [{
        // Execution requests are being fetched in the ScriptReportsOverview component on mount.
        // This way url query parameters can be used for the initial fetch.
        execute: triggerFetchEnvironments,
    }],
}, {
    routeKey: ROUTE_KEYS.R_NOT_FOUND,
    path: '*',
    component: NotFound,
}];

registerRoutes(ALL_ROUTES);
