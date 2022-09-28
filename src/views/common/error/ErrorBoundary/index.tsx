import React from 'react';
import { Box, Button, Paper, Typography } from '@material-ui/core';
import { ErrorOutlineRounded as ErrorIcon } from '@material-ui/icons';
import ThemeProvider from 'views/appShell/ThemeProvider';
import { redirectTo, ROUTE_KEYS } from 'views/routes';
import Translate from '@snipsonian/react/es/components/i18n/Translate';

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
        this.onRefreshClick = this.onRefreshClick.bind(this);
    }

    public componentDidCatch() {
        this.setState({
            hasError: true,
        });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <ThemeProvider
                    render={() => (
                        <Box height="100%">
                            <Box
                                position="relative"
                                display="flex"
                                flexDirection="column"
                                minHeight="100%"
                                justifyContent="center"
                            >
                                <Box width={540} maxWidth="90vw" marginX="auto">
                                    <Paper>
                                        <Box padding={3} textAlign="center">
                                            <Box marginBottom={2} textAlign="center" fontSize={80} lineHeight={0}>
                                                <ErrorIcon color="error" fontSize="inherit" />
                                            </Box>
                                            <Typography variant="h2" paragraph>
                                                <Translate msg="error.default.title" />
                                            </Typography>
                                            <Typography variant="body1" paragraph>
                                                <Translate msg="error.default.text" />
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={this.onRefreshClick}
                                            >
                                                <Translate msg="error.default.button" />
                                            </Button>
                                        </Box>
                                    </Paper>
                                </Box>
                            </Box>
                        </Box>
                    )}
                />
            );
        }
        return this.props.children;
    }

    private onRefreshClick() {
        this.resetErrorBoundary();
        redirectTo({ routeKey: ROUTE_KEYS.R_HOME });
    }

    private resetErrorBoundary() {
        this.setState({
            hasError: false,
        });
    }
}
