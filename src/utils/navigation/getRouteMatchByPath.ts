import { matchPath } from 'react-router-dom';
import { getRegisteredRoutes } from 'views/routes';

export default function getRouteMatchByPath(path: string) {
    const matchingRoutes = Object.values(getRegisteredRoutes())
        .map((route) => ({
            route,
            match: matchPath(path, route),
        }))
        .filter(({ match }) => match !== null);

    if (!matchingRoutes || matchingRoutes.length === 0) {
        return null;
    }

    const exactMatchingRoute = matchingRoutes
        .find((matchingRoute) =>
            matchingRoute.match.isExact);
    if (exactMatchingRoute) {
        return exactMatchingRoute;
    }

    return matchingRoutes.reduce(
        (accumulator, matchingRoute) => {
            if (!accumulator) {
                return matchingRoute;
            }

            /* take the one with the longest path */
            if (accumulator.route.path.length <= matchingRoute.route.path.length) {
                return matchingRoute;
            }

            return accumulator;
        },
        null,
    );
}
