import { IRoutes } from 'models/router.models';
import { ROUTE_KEYS, registerRoutes } from './routes';
import NotFound from './appShell/NotFound';
import Home from './Home';
import DesignOverview from './design/Overview';
import ReportOverview from './report/Overview';

const ALL_ROUTES: IRoutes = {
    [ROUTE_KEYS.R_HOME]: {
        path: '/',
        exact: true,
        component: Home,
    },
    [ROUTE_KEYS.R_SCRIPTS]: {
        path: '/design',
        component: DesignOverview,
    },
    [ROUTE_KEYS.R_REPORTS]: {
        path: '/report',
        component: ReportOverview,
    },
    [ROUTE_KEYS.R_NOT_FOUND]: {
        path: '*',
        component: NotFound,
    },
};

registerRoutes(ALL_ROUTES);
