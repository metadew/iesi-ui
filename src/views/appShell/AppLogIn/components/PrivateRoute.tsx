import * as React from 'react';
import {
    Route,
    Redirect,
    RouteProps,
} from 'react-router-dom';
import { useContext } from 'react';
import { UserSessionContext } from '../contexts/UserSessionContext';

interface IPrivateRouteProps extends RouteProps {
    component?: any;
    children?: any;
}

const PrivateRoute = (props: IPrivateRouteProps) => {
    const { component: Component, children, ...rest } = props;
    const userSession = useContext(UserSessionContext);

    return (
        <Route
            {...rest}
            render={(routeProps) =>
                (userSession.isAuthenticated() ? (
                    Component ? (
                        <Component {... routeProps} />
                    ) : (
                        children
                    )
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: routeProps.location },
                        }}
                    />
                ))}
        />
    );
};

export default PrivateRoute;
