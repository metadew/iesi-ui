import { IState } from 'models/state.models';
import * as React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

interface IPrivateRouteProps extends RouteProps {
    component?: any;
    children?: any;
    state: IState;
    isAuthenticated: boolean;
}

const PrivateRoute = (props: IPrivateRouteProps) => {
    const { component: Component, children, isAuthenticated, ...rest } = props;

    return (
        <Route
            {...rest}
            render={(routeProps) => {
                const { pathname, search } = routeProps.location as any || { pathname: '/', search: '' };
                return (isAuthenticated ? (
                    Component ? (
                        <Component {...routeProps} />
                    ) : (
                        children
                    )
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            search: `?url=${encodeURIComponent(
                                `${pathname}${search}`,
                            )}`,
                            state: { from: routeProps.location },
                        }}
                    />
                ));
            }}
        />
    );
};

export default PrivateRoute;
