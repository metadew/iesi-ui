import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { StateChangeNotification } from 'models/state.models';
import { hasRequiredAccessLevels } from 'state/auth/selectors';
import { IObserveProps, observe } from 'views/observe';
import { getRoute, getRoutePath, ROUTE_KEYS } from 'views/routes';

interface IPublicProps extends RouteProps {
    routeKey: ROUTE_KEYS;
}

function PermissionRoute({
    state,
    routeKey,
    children,
    path,
}: IPublicProps & IObserveProps) {
    const route = getRoute({ routeKey });
    const { component: Component, requiredAccessLevels } = route;

    const isAllowedToRoute = hasRequiredAccessLevels(state, requiredAccessLevels);

    return (
        <Route
            path={path}
            exact={route.exact}
            render={(routeProps) =>
                (isAllowedToRoute
                    ? (
                        Component ? <Component {...routeProps} /> : children
                    )
                    : (
                        // TODO Or show unauthorized page?
                        <Redirect
                            to={{
                                pathname: getRoutePath({ routeKey: ROUTE_KEYS.R_HOME }),
                                state: { from: routeProps.location },
                            }}
                        />
                    )
                )}
        />
    );
}

export default observe<IPublicProps>(
    [StateChangeNotification.AUTH],
    PermissionRoute,
);
