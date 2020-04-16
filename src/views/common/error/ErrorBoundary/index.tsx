import React from 'react';
import NavLink from 'views/common/navigation/NavLink';
import { Button } from '@material-ui/core';
import ROUTES from 'views/routes';
import ROUTE_KEYS from '../../../../routeKeys';

interface IComponentProps {
    children: JSX.Element[] | JSX.Element;
}

interface IComponentState {
    hasError: boolean;
}

export default class ErrorBoundary extends React.Component<IComponentProps, IComponentState> {
    public constructor(props: IComponentProps) {
        super(props);
        this.state = {
            hasError: false,
        };

        this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
    }

    public componentDidCatch() {
        this.setState({
            hasError: true,
        });
    }

    public render() {
        if (this.state.hasError) {
            const route = ROUTES[ROUTE_KEYS.R_HOME];
            const { path, exact } = route;
            return (
                <NavLink to={path} exact={exact}>
                    <Button onClick={this.resetErrorBoundary}>
                        To home
                    </Button>
                </NavLink>
            );
        }
        return this.props.children;
    }

    private resetErrorBoundary() {
        this.setState({
            hasError: false,
        });
    }
}
