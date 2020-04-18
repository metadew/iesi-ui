import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { getRouteByPath, getRoutePath, hasChildRoutes } from 'views/routes';

export default function renderChildComponentRoutes({ path }: { path: string }) {
    const route = getRouteByPath({ path });

    return (
        <Switch>
            {hasChildRoutes(route) && (
                route.childRoutes.map((childRoute) => {
                    const ChildRouteComponent = childRoute.component as React.ElementType;

                    return (
                        <Route
                            path={getRoutePath({ routeKey: childRoute.routeKey })}
                            key={`child-route_${childRoute.routeKey}`}
                        >
                            <ChildRouteComponent />
                        </Route>
                    );
                })
            )}
            {route.MainChildComponent && (
                <Route path={path}>
                    <route.MainChildComponent />
                </Route>
            )}
        </Switch>
    );
}
