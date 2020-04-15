import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { StateChangeNotification } from 'models/state.models';
import { hasRequiredAccessLevels } from 'state/auth/selectors';
import { observe, IObserveProps } from 'views/observe';
import ROUTE_KEYS from 'routeKeys';
import ROUTES from 'views/routes';

interface IPublicProps extends RouteProps {
    routeKey: ROUTE_KEYS;
}

function PermissionRoute({
    state,
    routeKey,
    children,
    path,
}: IPublicProps & IObserveProps) {
    const route = ROUTES[routeKey];
    const { component: Component, requiredAccessLevels } = route;

    const allowedToRoute = hasRequiredAccessLevels(state, requiredAccessLevels);

    return (
        <Route
            path={path}
            exact={route.exact}
            render={(routeProps) =>
                (allowedToRoute ? (
                    Component ? <Component {...routeProps} /> : children
                ) : (
                    // Or show unauthorized page?
                    <Redirect
                        to={{
                            pathname: '/',
                            state: { from: routeProps.location },
                        }}
                    />
                ))}
        />
    );
}

export default observe<IPublicProps>(
    [StateChangeNotification.AUTH],
    PermissionRoute,
);
