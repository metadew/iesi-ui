import { IRoute, IRoutes } from 'models/router.models';

export enum ROUTE_KEYS {
    R_HOME = 'R_HOME',

    /* design */
    R_SCRIPTS = 'R_SCRIPTS',
    R_SCRIPT_DETAIL = 'R_SCRIPT_DETAIL',

    /* reporting */
    R_REPORTS = 'R_REPORTS',
    R_REPORT_DETAIL = 'R_REPORT_DETAIL',

    R_NOT_FOUND = 'R_NOT_FOUND',
}

let registeredRoutes: IRoutes = {};

export function registerRoutes(routes: IRoutes) {
    registeredRoutes = routes;
}

export function getRegisteredRoutes(): IRoutes {
    return registeredRoutes;
}

export function getRoute({ routeKey }: { routeKey: ROUTE_KEYS }): IRoute {
    return registeredRoutes[routeKey];
}

export function getRoutePath({ routeKey }: { routeKey: ROUTE_KEYS }): string {
    return getRoute({ routeKey }).path;
}

export function getRouteKeyByPath({ path }: { path: string }): string {
    return getAllRouteKeys()
        .find((routeKey) => getRoute({ routeKey: routeKey as ROUTE_KEYS }).path === path);
}

function getAllRouteKeys(): string[] {
    return Object.keys(registeredRoutes);
}

export function getAllRoutesAsList(): { routeKey: ROUTE_KEYS; route: IRoute }[] {
    return Object.keys(registeredRoutes)
        .map((routeKey) => ({
            routeKey: routeKey as ROUTE_KEYS,
            route: registeredRoutes[routeKey],
        }));
}
