import { IRoutes } from 'models/router.models';
import DesignOverview from './design/Overview';
import ReportOverview from './report/Overview';
import ROUTE_KEYS from '../routeKeys';

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
};

export default ROUTES;
