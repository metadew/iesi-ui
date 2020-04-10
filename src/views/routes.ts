import { IRoutes } from 'models/router.models';
import DesignOverview from './design/Overview';
import ReportOverview from './report/Overview';
import ROUTE_KEYS from '../routeKeys';
import NotFound from './appShell/NotFound';

const ROUTES: IRoutes = {
    [ROUTE_KEYS.R_HOME]: {
        path: '/',
        exact: true,
        component: DesignOverview,
    },
    [ROUTE_KEYS.R_DESIGN]: {
        path: '/design',
        exact: true,
        component: DesignOverview,
    },
    [ROUTE_KEYS.R_REPORT]: {
        path: '/report',
        component: ReportOverview,
    },
    [ROUTE_KEYS.R_NOT_FOUND]: {
        path: '*',
        component: NotFound,
    },
};

export default ROUTES;
