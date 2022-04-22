import { IRoute } from 'models/router.models';
import { triggerFetchScripts, triggerFetchScriptDetail } from 'state/entities/scripts/triggers';
import {
    triggerFetchExecutionRequestDetail,
} from 'state/entities/executionRequests/triggers';
import {
    triggerFetchActionTypes,
    triggerFetchComponentTypes,
    triggerFetchConnectionTypes,
} from 'state/entities/constants/triggers';
import { triggerFetchComponentDetail, triggerFetchComponents } from 'state/entities/components/triggers';
import { triggerFetchConnectionDetail, triggerFetchConnections } from 'state/entities/connections/triggers';
import { triggerFetchDatasetDetail } from 'state/entities/datasets/triggers';
import { SortType, SortOrder } from 'models/list.models';
import { formatSortQueryParameter } from 'utils/core/string/format';
import { triggerFetchEnvironment, triggerFetchEnvironments } from 'state/entities/environments/triggers';
import { getStore } from 'state';
import {
    getComponentsListFilter,
    getConnectionsListFilter,
    getScriptsListFilter,
    // getEnvironmentsListFilter
} from 'state/ui/selectors';
import { IFetchScriptsListPayload } from 'models/state/scripts.models';
import { IFetchComponentsListPayload } from 'models/state/components.model';
// import { IFetchEnvironmentsListPayload } from 'models/state/environments.models';
import { ROUTE_KEYS, registerRoutes } from './routes';
import NotFound from './appShell/NotFound';
import Home from './Home';
import ScriptsTemplate from './design/ScriptsTemplate';
import ScriptsOverview from './design/ScriptsOverview';
import ScriptDetail from './design/ScriptDetail';
import ScriptReportsTemplate from './report/ScriptReportsTemplate';
import ScriptReportsOverview from './report/ScriptReportsOverview';
import ScriptReportDetail from './report/ScriptReportDetail';
import OpenAPI from './doc/OpenAPIOverview';
import OpenAPITemplate from './doc/OpenAPITemplate';
import ComponentsTemplate from './design/ComponentsTemplate';
import ComponentsOverview from './design/ComponentsOverview';
import ComponentDetail from './design/ComponentDetail';
import ConnectionTemplate from './connectivity/ConnectionTemplate';
import ConnectionOverview from './connectivity/ConnectionOverview';
import ConnectionDetail from './connectivity/ConnectionDetail';
import LoginView from './appShell/AppLogIn/LoginPage';
import DatasetsTemplate from './data/DatasetsTemplate';
import DatasetDetail from './data/DatasetDetail';
import DatasetOverview from './data/DatasetOverview';
import EnvironmentOverview from './environment/EnvironmentOverview';
import EnvironmentDetail from './environment/EnvironmentDetail';
import EnvironmentTemplate from './environment/EnvironmentTemplate';

const ALL_ROUTES: IRoute<ROUTE_KEYS>[] = [{
    routeKey: ROUTE_KEYS.R_HOME,
    path: '/',
    exact: true,
    component: Home,
}, {
    routeKey: ROUTE_KEYS.R_LOGIN,
    path: '/login',
    exact: true,
    component: LoginView,
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
    routeKey: ROUTE_KEYS.R_COMPONENTS,
    path: '/components',
    template: ComponentsTemplate,
    component: ComponentsOverview,
    childRoutes: [
        {
            routeKey: ROUTE_KEYS.R_COMPONENT_NEW,
            path: '/new',
            component: ComponentDetail as React.ComponentType<unknown>,
            executeOnRoute: [{
                execute: triggerFetchComponentTypes,
            }],
        }, {
            routeKey: ROUTE_KEYS.R_COMPONENT_DETAIL,
            path: '/:name/:version',
            component: ComponentDetail as React.ComponentType<unknown>,
            executeOnRoute: [{
                // TODO: Fix this typing error so we dont need to cast to () => unknown? Can this be simpler?
                // Maybe pass the routeLocation to the execute so we dont need the executeInputSelector prop?
                execute: triggerFetchComponentDetail as () => unknown,
                executeInputSelector: ({ routeLocation }) => ({
                    name: routeLocation.params.name,
                    version: routeLocation.params.version,
                }),
            }, {
                execute: triggerFetchComponentTypes,
            }],
        },
    ],
    executeOnRoute: [{
        execute: () => {
            const { getState } = getStore();
            const { filters, page, sortedColumn } = getComponentsListFilter(getState());

            const sort = sortedColumn || {
                name: 'name',
                sortOrder: SortOrder.Ascending,
                sortType: SortType.String,
            };

            const payload: IFetchComponentsListPayload = {
                sort: formatSortQueryParameter(sort),
                filter: {
                    ...(filters && {
                        name:
                            filters.name.values.length > 0
                            && filters.name.values[0].toString(),
                    }),
                },
                pagination: {
                    page,
                },
            };

            triggerFetchComponents(payload);
        },
    }],
}, {
    routeKey: ROUTE_KEYS.R_CONNECTIONS,
    path: '/connections',
    template: ConnectionTemplate,
    component: ConnectionOverview,
    childRoutes: [
        {
            routeKey: ROUTE_KEYS.R_CONNECTION_NEW,
            path: '/new',
            component: ConnectionDetail as React.ComponentType<unknown>,
            executeOnRoute: [{
                execute: triggerFetchConnectionTypes,
            }],
        }, {
            routeKey: ROUTE_KEYS.R_CONNECTION_DETAIL,
            path: '/:name',
            component: ConnectionDetail as React.ComponentType<unknown>,
            executeOnRoute: [{
                // TODO: Fix this typing error so we dont need to cast to () => unknown? Can this be simpler?
                // Maybe pass the routeLocation to the execute so we dont need the executeInputSelector prop?
                execute: triggerFetchConnectionDetail as () => unknown,
                executeInputSelector: ({ routeLocation }) => ({
                    name: routeLocation.params.name,
                }),
            }, {
                execute: triggerFetchConnectionTypes,
            }],
        },
    ],
    executeOnRoute: [{
        execute: () => {
            const { getState } = getStore();
            const { filters, page, sortedColumn } = getConnectionsListFilter(getState());

            const sort = sortedColumn || {
                name: 'name',
                sortOrder: SortOrder.Ascending,
                sortType: SortType.String,
            };

            const payload: IFetchComponentsListPayload = {
                sort: formatSortQueryParameter(sort),
                filter: {
                    ...(filters && {
                        name:
                            filters.name.values.length > 0
                            && filters.name.values[0].toString(),
                    }),
                },
                pagination: {
                    page,
                },
            };

            triggerFetchConnections(payload);
        },
    }],
}, {
    routeKey: ROUTE_KEYS.R_ENVIRONMENTS,
    path: '/environments',
    template: EnvironmentTemplate,
    component: EnvironmentOverview,
    childRoutes: [{
        routeKey: ROUTE_KEYS.R_ENVIRONMENT_NEW,
        path: '/new',
        component: EnvironmentDetail as React.ComponentType<unknown>,
    }, {
        routeKey: ROUTE_KEYS.R_ENVIRONMENT_DETAIL,
        path: '/:name',
        component: EnvironmentDetail as React.ComponentType<unknown>,
        executeOnRoute: [{
            execute: triggerFetchEnvironment as () => unknown,
            executeInputSelector: ({ routeLocation }) => ({
                name: routeLocation.params.name,
            }),
        }],
    }],
    /* executeOnRoute: [{
        execute: () => {
            const { getState } = getStore();
            const { filters, page, sortedColumn } = getEnvironmentsListFilter(getState());

            const sort = sortedColumn || {
                name: 'name',
                sortOrder: SortOrder.Ascending,
                sortType: SortType.String,
            };

            const payload: IFetchEnvironmentsListPayload = {
                sort: formatSortQueryParameter(sort),
                filter: {
                    ...(filters && {
                        name:
                            filters.name.values.length > 0
                            && filters.name.values[0].toString(),
                    }),
                },
                pagination: {
                    page,
                },
            };

            triggerFetchEnvironments(payload);
        },
    }], */
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
    routeKey: ROUTE_KEYS.R_DATASETS,
    path: '/datasets',
    template: DatasetsTemplate,
    component: DatasetOverview,
    childRoutes: [{
        routeKey: ROUTE_KEYS.R_DATASET_NEW,
        path: '/new',
        component: DatasetDetail as React.ComponentType<unknown>,
    }, {
        routeKey: ROUTE_KEYS.R_DATASET_DETAIL,
        path: '/:name',
        component: DatasetDetail as React.ComponentType<unknown>,
        executeOnRoute: [{
            execute: triggerFetchDatasetDetail as () => unknown,
            executeInputSelector: ({ routeLocation }) => ({
                name: routeLocation.params.name,
            }),
        }],
    }],
}, {
    routeKey: ROUTE_KEYS.R_OPENAPI,
    path: '/openapi',
    template: OpenAPITemplate,
    component: OpenAPI,
    executeOnRoute: [{
        execute: () => triggerFetchConnectionTypes(),
    }, {
        execute: () => triggerFetchComponentTypes(),
    }],
}, {
    routeKey: ROUTE_KEYS.R_NOT_FOUND,
    path: '/not-found',
    component: NotFound,
},
];

registerRoutes(ALL_ROUTES);
