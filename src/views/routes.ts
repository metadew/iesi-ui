import isSet from '@snipsonian/core/es/is/isSet';
import createObserverManager from '@snipsonian/core/es/patterns/createObserverManager';
import { History } from 'history';
import { IRoute, IRoutesMap, INavigateToRoute, IRouteLocation } from 'models/router.models';
import replacePathPlaceholders from 'utils/navigation/replacePathPlaceholders';

export enum ROUTE_KEYS {
    R_HOME = 'R_HOME',

    /* design */
    R_SCRIPTS = 'R_SCRIPTS',
    R_SCRIPT_DETAIL = 'R_SCRIPT_DETAIL',
    R_SCRIPT_NEW = 'R_SCRIPT_NEW',

    /* reporting */
    R_REPORTS = 'R_REPORTS',
    R_REPORT_DETAIL = 'R_REPORT_DETAIL',

    R_NOT_FOUND = 'R_NOT_FOUND',
}

let registeredRoutes: IRoutesMap<ROUTE_KEYS> = {};
const parentRouteKeys: ROUTE_KEYS[] = [];
let browserHistory: History = null;
const routeObserverManager = createObserverManager();

export function registerRoutes(allRoutes: IRoute<ROUTE_KEYS>[]) {
    registeredRoutes = allRoutes.reduce(
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
}

function convertChildRoutes(parentRoute: IRoute<ROUTE_KEYS>): IRoutesMap<ROUTE_KEYS> {
    if (!hasChildRoutes(parentRoute)) {
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

export function getRouteByPath({ path }: { path: string }): IRoute<ROUTE_KEYS> {
    return Object.values(getRegisteredRoutes())
        .find((route) => route.path === path);
}

export function getRouteKeyByPath({ path }: { path: string }): string {
    return getRouteByPath({ path }).path;
}

export function getAllRouteKeys(): ROUTE_KEYS[] {
    return Object.keys(registeredRoutes) as ROUTE_KEYS[];
}

export function getParentRouteKeys(): ROUTE_KEYS[] {
    return parentRouteKeys;
}

export function hasChildRoutes(route: IRoute<ROUTE_KEYS>): boolean {
    return route.childRoutes && route.childRoutes.length > 0;
}

export function setBrowserHistory(history: History) {
    if (browserHistory === null) {
        /* history is mutable, so we only have to set it once */
        browserHistory = history;
    }
}

export function redirectTo({ routeKey, params, queryParams }: INavigateToRoute) {
    if (browserHistory) {
        browserHistory.push({
            pathname: replacePathPlaceholders({
                path: getRoutePath({ routeKey }),
                placeholders: params,
            }),
            search: queryParams
                ? Object.keys(queryParams).map((key) => `${key}=${queryParams[key]}`).join('&')
                : '',
        });
    }
}

export function registerRouteObserver(onRoute: (routeLocation: IRouteLocation) => void) {
    routeObserverManager.registerObserver({
        onNotify: onRoute,
        onError: () => {},
    });
}

export function notifyRouteObservers(routeLocation: IRouteLocation) {
    routeObserverManager.notifyObservers(routeLocation);
}
