import { IRoute } from 'models/router.models';
import { ROUTE_KEYS, registerRoutes } from './routes';
import NotFound from './appShell/NotFound';
import Home from './Home';
import ScriptsOverview from './design/ScriptsOverview';
import ScriptReportsTemplate from './report/ScriptReportsTemplate';
import ScriptReportsOverview from './report/ScriptReportsOverview';
import ScriptReportDetail from './report/ScriptReportDetail';

const ROUTES: IRoute<ROUTE_KEYS>[] = [{
    routeKey: ROUTE_KEYS.R_HOME,
    path: '/',
    exact: true,
    component: Home,
}, {
    routeKey: ROUTE_KEYS.R_SCRIPTS,
    path: '/scripts',
    component: ScriptsOverview,
    childRoutes: [{
        routeKey: ROUTE_KEYS.R_SCRIPT_DETAIL,
        path: '/:scriptId',
    }],
}, {
    routeKey: ROUTE_KEYS.R_REPORTS,
    path: '/reports',
    component: ScriptReportsTemplate,
    MainChildComponent: ScriptReportsOverview,
    childRoutes: [{
        routeKey: ROUTE_KEYS.R_REPORT_DETAIL,
        path: '/:reportId',
        component: ScriptReportDetail,
    }],
}, {
    routeKey: ROUTE_KEYS.R_NOT_FOUND,
    path: '*',
    component: NotFound,
}];

registerRoutes(ROUTES);
