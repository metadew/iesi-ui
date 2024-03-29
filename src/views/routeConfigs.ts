import React from 'react';
import { IRoute } from 'models/router.models';
import { triggerFetchScriptDetail } from 'state/entities/scripts/triggers';
import { triggerFetchExecutionRequestDetail } from 'state/entities/executionRequests/triggers';
import { triggerFetchComponentDetail } from 'state/entities/components/triggers';
import { triggerFetchConnectionDetail } from 'state/entities/connections/triggers';
import { triggerFetchDatasetDetail } from 'state/entities/datasets/triggers';
import { triggerFetchEnvironment } from 'state/entities/environments/triggers';
// import { IFetchEnvironmentsListPayload } from 'models/state/environments.models';
import { triggerFetchUserDetail } from 'state/entities/users/triggers';
import { triggerFetchTeamDetail } from 'state/entities/teams/triggers';
import { triggerFetchSecurityGroupDetail } from 'state/entities/securityGroups/triggers';
import TemplatesTemplate from 'views/design/templates/TemplatesTemplate';
import TemplatesOverview from 'views/design/templates/TemplatesOverview';
import TemplateDetail from 'views/design/templates/TemplateDetail';
import { triggerFetchTemplate } from 'state/entities/templates/triggers';
import { registerRoutes, ROUTE_KEYS } from './routes';
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
import UserTemplate from './iam/users/UserTemplate';
import UserOverview from './iam/users/UserOverview';
import UserDetail from './iam/users/UserDetail';
import TeamTemplate from './iam/teams/TeamTemplate';
import TeamsOverview from './iam/teams/TeamsOverview';
import TeamDetail from './iam/teams/TeamDetail';
import SecurityGroupTemplate from './iam/securityGroups/SecurityGroupTemplate';
import SecurityGroupOverview from './iam/securityGroups/SecurityGroupOverview';
import SecurityGroupDetail from './iam/securityGroups/SecurityGroupDetail';

const ALL_ROUTES: IRoute<ROUTE_KEYS>[] = [{
    routeKey: ROUTE_KEYS.R_HOME,
    path: '/',
    exact: true,
    component: Home as React.FunctionComponent<unknown>,
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
            executeOnRoute: [],
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
            }],
        },
    ],
    executeOnRoute: [],
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
            executeOnRoute: [],
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
            }],
        },
    ],
    executeOnRoute: [],
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
            executeOnRoute: [],
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
            }],
        },
    ],
    executeOnRoute: [],
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
    routeKey: ROUTE_KEYS.R_TEMPLATES,
    path: '/templates',
    template: TemplatesTemplate,
    component: TemplatesOverview,
    childRoutes: [{
        routeKey: ROUTE_KEYS.R_TEMPLATE_NEW,
        path: '/new',
        component: TemplateDetail as React.ComponentType<unknown>,
    }, {
        routeKey: ROUTE_KEYS.R_TEMPLATE_DETAIL,
        path: '/:name/:version',
        component: TemplateDetail as React.ComponentType<unknown>,
        executeOnRoute: [{
            execute: triggerFetchTemplate as () => unknown,
            executeInputSelector: ({ routeLocation }) => ({
                name: routeLocation.params.name,
                version: routeLocation.params.version,
            }),
        }],
    }],
}, {
    routeKey: ROUTE_KEYS.R_USERS,
    path: '/users',
    template: UserTemplate,
    component: UserOverview,
    childRoutes: [{
        routeKey: ROUTE_KEYS.R_USER_NEW,
        path: '/new',
        component: UserDetail as React.ComponentType<unknown>,
    }, {
        routeKey: ROUTE_KEYS.R_USER_DETAIL,
        path: '/:name',
        component: UserDetail as React.ComponentType<unknown>,
        executeOnRoute: [{
            execute: triggerFetchUserDetail as () => unknown,
            executeInputSelector: ({ routeLocation }) => ({
                name: routeLocation.params.name,
            }),
        }],
    }],
}, {
    routeKey: ROUTE_KEYS.R_TEAMS,
    path: '/teams',
    template: TeamTemplate,
    component: TeamsOverview,
    childRoutes: [{
        routeKey: ROUTE_KEYS.R_TEAM_NEW,
        path: '/new',
        component: TeamDetail as React.ComponentType<unknown>,
    }, {
        routeKey: ROUTE_KEYS.R_TEAM_DETAIL,
        path: '/:name',
        component: TeamDetail as React.ComponentType<unknown>,
        executeOnRoute: [{
            execute: triggerFetchTeamDetail as () => unknown,
            executeInputSelector: ({ routeLocation }) => ({
                name: routeLocation.params.name,
            }),
        }],
    }],
}, {
    routeKey: ROUTE_KEYS.R_SECURITY_GROUPS,
    path: '/security-groups',
    template: SecurityGroupTemplate,
    component: SecurityGroupOverview,
    childRoutes: [{
        routeKey: ROUTE_KEYS.R_SECURITY_GROUP_NEW,
        path: '/new',
        component: SecurityGroupDetail as React.ComponentType<unknown>,
    }, {
        routeKey: ROUTE_KEYS.R_SECURITY_GROUP_DETAIL,
        path: '/:name',
        component: SecurityGroupDetail as React.ComponentType<unknown>,
        executeOnRoute: [{
            execute: triggerFetchSecurityGroupDetail as () => unknown,
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
    executeOnRoute: [],
}, {
    routeKey: ROUTE_KEYS.R_NOT_FOUND,
    path: '/not-found',
    component: NotFound,
},
];

registerRoutes(ALL_ROUTES);
