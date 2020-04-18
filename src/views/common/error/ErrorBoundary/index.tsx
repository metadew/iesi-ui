import React from 'react';
import { Button } from '@material-ui/core';
import { ROUTE_KEYS } from 'views/routes';
import RouteLink from 'views/common/navigation/RouteLink';

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
            // TODO render something nice in case of error
            return (
                <RouteLink to={ROUTE_KEYS.R_HOME} exact>
                    <Button onClick={this.resetErrorBoundary}>
                        To home
                    </Button>
                </RouteLink>
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
