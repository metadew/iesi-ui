import React from 'react';
import { Button } from '@material-ui/core';
import { getRoute, ROUTE_KEYS } from 'views/routes';
import NavLink from 'views/common/navigation/NavLink';

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
            const { path, exact } = getRoute({ routeKey: ROUTE_KEYS.R_HOME });

            // TODO render something nicer in case of error
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
