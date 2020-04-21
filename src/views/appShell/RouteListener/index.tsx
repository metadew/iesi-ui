import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { notifyRouteObservers, setBrowserHistory } from 'views/routes';
import getRouteMatchByPath from 'utils/navigation/getRouteMatchByPath';

let isInitialRoute = true;

export default function RouteListener() {
    const history = useHistory();
    const location = useLocation();

    setBrowserHistory(history);
    const { listen } = history;

    if (isInitialRoute) {
        isInitialRoute = false;

        const { route, match } = getRouteMatchByPath(location.pathname);

        notifyRouteObservers({
            routeKey: route.routeKey,
            path: route.path,
            url: location.pathname,
            params: match.params,
        });
    }

    useEffect(() => {
        const unlisten = listen((historyLocation) => {
            const { route, match } = getRouteMatchByPath(historyLocation.pathname);

            notifyRouteObservers({
                routeKey: route.routeKey,
                path: route.path,
                url: historyLocation.pathname,
                params: match.params,
            });
        });

        return unlisten;
    }, [listen]);
}
