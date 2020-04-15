import { IRoutes } from 'models/router.models';
import DesignOverview from './design/Overview';
import ReportOverview from './report/Overview';
import ROUTE_KEYS from '../routeKeys';
import NotFound from './appShell/NotFound';
import TestPermissions from './TestPermissions';
import Home from './Home';

const ROUTES: IRoutes = {
    [ROUTE_KEYS.R_HOME]: {
        path: '/',
        exact: true,
        component: Home,
    },
    [ROUTE_KEYS.R_DESIGN]: {
        path: '/design',
        component: DesignOverview,
    },
    [ROUTE_KEYS.R_REPORT]: {
        path: '/report',
        component: ReportOverview,
    },
    [ROUTE_KEYS.R_PRIVATE]: {
        path: '/test-permissions',
        component: TestPermissions,
        requiredAccessLevels: {
            edit: true,
            execute: false,
        },
    },
    [ROUTE_KEYS.R_NOT_FOUND]: {
        path: '*',
        component: NotFound,
    },
};

export default ROUTES;
