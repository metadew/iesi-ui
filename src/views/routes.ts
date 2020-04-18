import isSet from '@snipsonian/core/es/is/isSet';
import { IRoute, IRoutesMap } from 'models/router.models';

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

let registeredRoutes: IRoutesMap<ROUTE_KEYS> = {};
const parentRouteKeys: ROUTE_KEYS[] = [];

export function registerRoutes(routes: IRoute<ROUTE_KEYS>[]) {
    const routesAsMap = routes.reduce(
        (accumulator, route) => {
            accumulator[route.routeKey] = route;
            parentRouteKeys.push(route.routeKey);

            return {
                ...accumulator,
                ...convertChildRoutes(route),
            };
        },
        {} as IRoutesMap<ROUTE_KEYS>,
    );

    registeredRoutes = {
        ...registeredRoutes,
        ...routesAsMap,
    };
}

function convertChildRoutes(parentRoute: IRoute<ROUTE_KEYS>): IRoutesMap<ROUTE_KEYS> {
    if (!parentRoute.childRoutes || parentRoute.childRoutes.length === 0) {
        return {};
    }

    return parentRoute.childRoutes
        .reduce(
            (accumulator, childRoute) => {
                const convertedChildRoute = {
                    ...childRoute,
                    path: `${parentRoute.path}${childRoute.path}`,
                    allowAnonymousAccess: isSet(childRoute.allowAnonymousAccess)
                        ? childRoute.allowAnonymousAccess
                        : parentRoute.allowAnonymousAccess,
                    requiredAccessLevels: isSet(childRoute.requiredAccessLevels)
                        ? childRoute.requiredAccessLevels
                        : parentRoute.requiredAccessLevels,
                };

                accumulator[childRoute.routeKey] = convertedChildRoute;

                return {
                    ...accumulator,
                    ...convertChildRoutes(convertedChildRoute),
                };
            },
            {} as IRoutesMap<ROUTE_KEYS>,
        );
}

export function getRegisteredRoutes(): IRoutesMap<ROUTE_KEYS> {
    return registeredRoutes;
}

export function getRoute({ routeKey }: { routeKey: ROUTE_KEYS }): IRoute<ROUTE_KEYS> {
    return registeredRoutes[routeKey];
}

export function getRoutePath({ routeKey }: { routeKey: ROUTE_KEYS }): string {
    return getRoute({ routeKey }).path;
}

export function getRouteKeyByPath({ path }: { path: string }): string {
    return getAllRouteKeys()
        .find((routeKey) => getRoute({ routeKey: routeKey as ROUTE_KEYS }).path === path);
}

export function getAllRouteKeys(): ROUTE_KEYS[] {
    return Object.keys(registeredRoutes) as ROUTE_KEYS[];
}

export function getParentRouteKeys(): ROUTE_KEYS[] {
    return parentRouteKeys;
}
