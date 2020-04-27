import React from 'react';
import { Box } from '@material-ui/core';
import { Route, Switch } from 'react-router-dom';
import { getRoute } from 'views/routes';
import { IObserveProps, observe } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { getAllowedParentRouteKeys } from 'state/auth/selectors';

function AppBody({ state }: IObserveProps) {
    return (
        <Box flex="1 1 auto">
            <Switch>
                {getAllowedParentRouteKeys(state).map((routeKey) => {
                    const { path, exact, component, template } = getRoute({ routeKey });

                    const parentComponent = template
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ? template as React.ComponentType<any>
                        : component;

                    return (
                        <Route
                            key={routeKey}
                            path={path}
                            exact={exact}
                            component={parentComponent}
                        />
                    );
                })}
            </Switch>
        </Box>
    );
}

export default observe(
    [StateChangeNotification.AUTH],
    AppBody,
);
