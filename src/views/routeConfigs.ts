import { IRoute } from 'models/router.models';
import { triggerFetchScripts, triggerFetchScriptDetail } from 'state/entities/scripts/triggers';
import {
    triggerFetchExecutionRequestDetail,
} from 'state/entities/executionRequests/triggers';
import { triggerFetchActionTypes } from 'state/entities/constants/triggers';
import { SortType, SortOrder } from 'models/list.models';
import { formatSortQueryParameter } from 'utils/core/string/format';
import { triggerFetchEnvironments } from 'state/entities/environments/triggers';
import { getStore } from 'state';
import { getScriptsListFilter } from 'state/ui/selectors';
import { IFetchScriptsListPayload } from 'models/state/scripts.models';
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
        execute: () => {
            const { getState } = getStore();
            const { filters, onlyShowLatestVersion, page, sortedColumn } = getScriptsListFilter(getState());

            const sort = sortedColumn || {
                name: 'name',
                sortOrder: SortOrder.Ascending,
                sortType: SortType.String,
            };

            const payload: IFetchScriptsListPayload = {
                sort: formatSortQueryParameter(sort),
                filter: {
                    version: onlyShowLatestVersion ? 'latest' : undefined,
                    ...(filters && {
                        name:
                            filters.name.values.length > 0
                                && filters.name.values[0].toString(),
                        label:
                            filters.labels.values.length > 0
                                && filters.labels.values[0].toString(),
                    }),
                },
                pagination: {
                    page,
                },
            };

            triggerFetchScripts({
                expandResponseWith: {
                    scheduling: false, // Default = true
                },
                ...payload,
            });
        },
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
