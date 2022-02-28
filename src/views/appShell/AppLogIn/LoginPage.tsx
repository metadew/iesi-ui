import React from 'react';
import { getStore } from 'state';
import { IObserveProps } from 'views/observe';
import { Button, Container, Typography, Box, createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import TextInput from 'views/common/input/TextInput';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { Alert } from '@material-ui/lab';
import { triggerLogon } from 'state/auth/actions';
import { redirectToPath } from 'views/routes';
import { logon } from '../../../api/security/security.api';
import { ReactComponent as IesiLogo } from './logo.svg';

const styles = ({ palette, typography }: Theme) =>
    createStyles({
        header: {
            backgroundColor: palette.background.paper,
            borderBottom: '1px solid',
            borderBottomColor: palette.grey[200],
        },
        componentName: {
            fontWeight: typography.fontWeightBold,
            color: palette.primary.main,
        },
        componentType: {
            fontWeight: typography.fontWeightBold,
        },
        componentVersion: {
            fontWeight: typography.fontWeightBold,
        },
        componentDescription: {
            fontWeight: typography.fontWeightBold,
            fontSize: typography.pxToRem(12),
        },
    });

type TProps = WithStyles<typeof styles>;

interface IRedirectUri {
    pathname: string;
    search: string;
}

interface ILoginState {
    hasSubmitErrors: boolean;
    username: string;
    password: string;
    showPassword: boolean;
    redirectUri: IRedirectUri;
}

const LoginView = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, ILoginState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);
            // TODO: include redirection info for successful authentication
            // use redirect to?
            const searchParams = new URLSearchParams(window.location.search);
            const redirectUri = searchParams.get('url') || '/';
            const pathname: string = redirectUri.split('?')[0] || '/';
            const search: string = redirectUri.split('?')[1] || '';
            this.state = {
                hasSubmitErrors: false,
                username: '',
                password: '',
                showPassword: false,
                redirectUri: {
                    pathname,
                    search,
                },
            };
            // retrieve calling url from query param using
            // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
            this.setHasSubmitErrors = this.setHasSubmitErrors.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.renderAlert = this.renderAlert.bind(this);
            this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
        }

        public render() {
            const { hasSubmitErrors, username, password, showPassword } = this.state;
            return (
                <>
                    <Container component="main" maxWidth="xs">
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                            marginTop="85px"
                        >
                            <Typography component="h1" variant="h6">
                                <IesiLogo title="iesiLogo" />
                                IESI Automation
                            </Typography>
                        </Box>
                        <TextInput
                            id="username"
                            label="username"
                            margin="normal"
                            required
                            error={hasSubmitErrors && username === ''}
                            value={username}
                            onChange={(e) => this.setState({ username: e.target.value as string })}
                        />
                        <TextInput
                            id="password"
                            required
                            error={hasSubmitErrors && password === ''}
                            value={password}
                            type={showPassword ? 'text' : 'password'}
                            onChange={(e) => this.setState({ password: e.target.value as string })}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={this.handleClickShowPassword}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {this.renderAlert()}
                        <Box textAlign="center" marginTop={5}>
                            <Button
                                variant="contained"
                                size="medium"
                                color="primary"
                                disableElevation
                                onClick={this.handleSubmit}
                            >
                                <Container component="main" maxWidth="xl">
                                    <Translate msg="login" />
                                </Container>
                            </Button>
                        </Box>
                    </Container>
                </>
            );
        }

        handleClickShowPassword() {
            const { showPassword } = this.state;
            this.setState({ showPassword: !showPassword });
        }

        private setHasSubmitErrors(hasSubmitErrors: boolean) {
            this.setState({ hasSubmitErrors: hasSubmitErrors as boolean });
        }

        private handleSubmit = () => {
            const { username, password, redirectUri } = this.state;
            const { dispatch } = getStore();
            if (username !== '' && password !== '') {
                this.setHasSubmitErrors(false);

                logon({
                    username,
                    password,
                })
                    .then(async (response) => {
                        dispatch(triggerLogon(response));
                        redirectToPath(redirectUri.pathname, redirectUri.search);
                    })
                    .catch((error) => {
                        console.error('There was an error!', error);
                        this.setHasSubmitErrors(true);
                    })
                    .finally(() => {
                        this.setState({ password: '' });
                    });
            } else {
                this.setHasSubmitErrors(true);
            }
        };

        private renderAlert = () => {
            const { hasSubmitErrors } = this.state;
            if (!hasSubmitErrors) return null;
            return (
                <Alert severity="error">
                    <Translate msg="Username and/or password is incorrect!" />
                </Alert>
            );
        };
    },
);

export default LoginView;
