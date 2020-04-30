import { getStore } from 'state/index';
import { getRoute, registerRouteObserver } from '../views/routes';

registerRouteObserver((routeLocation) => {
    const { executeOnRoute } = getRoute({ routeKey: routeLocation.routeKey });

    doOnRouteExecutions();

    function doOnRouteExecutions() {
        if (executeOnRoute && executeOnRoute.length > 0) {
            executeOnRoute.forEach(({ execute, executeInputSelector, dispatchResult }) => {
                const executeInput = executeInputSelector
                    ? executeInputSelector({ routeLocation })
                    : null;

                const result = execute(executeInput);

                if (dispatchResult) {
                    getStore().dispatch(result);
                }
            });
        }
    }
});
