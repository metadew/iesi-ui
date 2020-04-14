import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { IAccessLevel } from 'models/router.models';
import { StateChangeNotification } from 'models/state.models';
import { hasRequiredAccessLevels } from 'state/auth/selectors';
import { observe, IObserveProps } from 'views/observe';

interface IPermissionRoute extends RouteProps {
    requiredAccessLevels: Partial<IAccessLevel>;
}

function PermissionRoute({
    state,
    requiredAccessLevels,
    children,
    component,
    ...rest
}: IPermissionRoute & IObserveProps) {
    const Component = component;
    const allowedToRoute = hasRequiredAccessLevels(state, requiredAccessLevels);

    return (
        <Route
            {...rest}
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

export default observe<IPermissionRoute>(
    [StateChangeNotification.AUTH],
    PermissionRoute,
);
