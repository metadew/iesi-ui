import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { getRoute } from 'views/routes';
import { IObserveProps, observe } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { getAllowedParentRouteKeys } from 'state/auth/selectors';

function AppBody({ state }: IObserveProps) {
    return (
        <div>
            <Switch>
                {getAllowedParentRouteKeys(state).map((routeKey) => {
                    const { path, exact, component } = getRoute({ routeKey });
                    return (
                        <Route
                            key={routeKey}
                            path={path}
                            exact={exact}
                            component={component}
                        />
                    );
                })}
            </Switch>
        </div>
    );
}

export default observe(
    [StateChangeNotification.AUTH],
    AppBody,
);
