import isSet from '@snipsonian/core/es/is/isSet';
import createObserverManager from '@snipsonian/core/es/patterns/createObserverManager';
import { History } from 'history';
import { IRoute, IRoutesMap, INavigateToRoute, IRouteLocation } from 'models/router.models';
import replacePathPlaceholders from 'utils/navigation/replacePathPlaceholders';

export enum ROUTE_KEYS {
    R_HOME = 'R_HOME',
    R_LOGIN = 'R_LOGIN',
    /* design */
    R_SCRIPTS = 'R_SCRIPTS',
    R_SCRIPT_DETAIL = 'R_SCRIPT_DETAIL',
    R_SCRIPT_NEW = 'R_SCRIPT_NEW',
    R_COMPONENTS = 'R_COMPONENTS',
    R_COMPONENT_DETAIL = 'R_COMPONENT_DETAIL',
    R_COMPONENT_NEW = 'R_COMPONENT_NEW',
    R_CONNECTIONS = 'R_CONNECTIONS',
    R_CONNECTION_DETAIL = 'R_CONNECTION_DETAIL',
    R_CONNECTION_NEW = 'R_CONNECTION_NEW',
    /* reporting */
    R_REPORTS = 'R_REPORTS',
    R_REPORT_DETAIL = 'R_REPORT_DETAIL',
    R_NOT_FOUND = 'R_NOT_FOUND',
    /* Dataset */
    R_DATASETS = 'R_DATASETS',
    R_DATASET_DETAIL = 'R_DATASET_DETAIL',
    R_DATASET_NEW = 'R_DATASET_NEW',
    /* Security groups */
    R_SECURITY_GROUPS = 'R_SECURITY_GROUPS',
    R_SECURITY_GROUP_DETAIL = 'R_SECURITY_GROUP_DETAIL',
    R_SECURITY_GROUP_NEW = 'R_SECURITY_GROUP_NEW',
    /* User */
    R_USERS = 'R_USERS',
    R_USER_DETAIL = 'R_USER_DETAIL',
    R_USER_NEW = 'R_USER_NEW',
    /* TEAM */
    R_TEAMS = 'R_TEAMS',
    R_TEAM_DETAIL = 'R_TEAM_DETAIL',
    R_TEAM_NEW = 'R_TEAM_NEW',
    /* TEMPLATES */
    R_TEMPLATES = 'R_TEMPLATES',
    R_TEMPLATE_DETAIL = 'R_TEMPLATE_DETAIL',
    R_TEMPLATE_NEW = 'R_TEMPLATE_NEW',
    /* OpenAPI */
    R_OPENAPI = 'R_OPENAPI'
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

export function getRouteKeyByPath({ path }: {path: string}) {
    return getAllRouteKeys()
        .find((routeKey) => getRoute({ routeKey }).path === path);
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

export function redirectTo({ routeKey, params, queryParams, newTab = false }: INavigateToRoute) {
    if (browserHistory) {
        // Do this on the next frame to make sure everything routeObserverManager has been registered
        window.requestAnimationFrame(() => {
            const pathname = replacePathPlaceholders({
                path: getRoutePath({ routeKey }),
                placeholders: params,
            });
            const search = queryParams
                ? Object.keys(queryParams).map((key) => `${key}=${queryParams[key]}`).join('&')
                : '';
            if (newTab) {
                window.open(pathname + search);
            } else {
                browserHistory.push({
                    pathname,
                    search,
                });
            }
        });
    }
}
export function redirectToPath(pathname: string, search: string) {
    if (browserHistory) {
        // Do this on the next frame to make sure everything routeObserverManager has been registered
        window.requestAnimationFrame(() => {
            browserHistory.push({
                pathname,
                search,
            });
        });
    }
}

// Create copy of above and provide simple url

export function registerRouteObserver(onRoute: (routeLocation: IRouteLocation) => void) {
    routeObserverManager.registerObserver({
        onNotify: onRoute,
        onError: () => {},
    });
}

export function notifyRouteObservers(routeLocation: IRouteLocation) {
    routeObserverManager.notifyObservers(routeLocation);
}
