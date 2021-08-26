import { IState } from 'models/state.models';
import * as React from 'react';
import {
    Route,
    Redirect,
    RouteProps,
} from 'react-router-dom';
import { isAuthenticated } from 'state/auth/selectors';

interface IPrivateRouteProps extends RouteProps {
    component?: any;
    children?: any;
    state: IState;
}

const PrivateRoute = (props: IPrivateRouteProps) => {
    const { component: Component, children, state, ...rest } = props;
    return (
        <Route
            {...rest}
            render={(routeProps) =>
                (isAuthenticated(state) ? (
                    Component ? (
                        <Component {... routeProps} />
                    ) : (
                        children
                    )
                ) : (
                    <Redirect
                        to={{
                            pathname: `/login?url=${routeProps.location}`,
                            state: { from: routeProps.location },
                        }}
                    />
                ))}
        />
    );
};

export default PrivateRoute;
