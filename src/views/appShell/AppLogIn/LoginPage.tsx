import React from 'react';
import { extractAccessLevelFromUser, getUserUuidFromToken } from 'state/auth/selectors';
import { IObserveProps } from 'views/observe';
import { IAccessToken, IUser } from 'models/state/auth.models';
import { Button, Container, Typography, Box, createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
// import { useHistory, useLocation } from 'react-router-dom';
import TextInput from 'views/common/input/TextInput';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { Alert } from '@material-ui/lab';
import { ReactComponent as IesiLogo } from './logo.svg';
import { fetchUserByUuid, logon } from '../../../api/security/security.api';
// import { redirectTo, redirectToPath } from 'views/routes';

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

interface ILoginState {
    hasSubmitErrors: boolean;
    username: string;
    password: string;
}

const LoginView = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, ILoginState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);
            // TODO: include redirection info for successful authentication
            // use redirect to?
            this.state = {
                hasSubmitErrors: false,
                username: '',
                password: '',
            };
            // retrieve calling url from query param using
            // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
            console.log(window.location.search);
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.forEach((searchParam) => console.log(searchParam));
            this.setHasSubmitErrors = this.setHasSubmitErrors.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.renderAlert = this.renderAlert.bind(this);
        }

        public render() {
            const { hasSubmitErrors, username, password } = this.state;

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
                            label="password"
                            type="password"
                            required
                            error={hasSubmitErrors && password === ''}
                            value={password}
                            onChange={(e) => this.setState({ password: e.target.value as string })}
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

        private setHasSubmitErrors(hasSubmitErrors: boolean) {
            this.setState({ hasSubmitErrors: hasSubmitErrors as boolean });
        }

        private handleSubmit = () => {
            const { username, password } = this.state;
            if (username !== '' && password !== '') {
                this.setHasSubmitErrors(false);

                logon({
                    username,
                    password,
                })
                    .then(async (response) => {
                        // set Access Token to AuthState
                        // Decode JWT token
                        // extract user uuid and fetch user roles
                        // set auth info:

                        // eslint-disable-next-line max-len
                        // check for error response
                        // TODO: set state
                        if (response.accessToken) {
                            const accessToken: IAccessToken = getUserUuidFromToken(response.accessToken);
                            console.log(response.accessToken);
                            this.setState((state) => ({
                                ...state,
                                auth: { accessToken: response.accessToken, username: accessToken.sub },
                            }));
                            fetchUserByUuid({ uuid: accessToken.uuid })
                                .then(async (user: IUser) => {
                                    // Decode JWT token
                                    // extract user uuid and fetch user roles
                                    this.setState((state) => ({
                                        ...state,
                                        auth: { permissions: extractAccessLevelFromUser(user) },
                                    }));

                                    // TODO: do redirectTo(...)
                                    // redirectToPath();
                                    // history.replace(from.pathname + from.search);
                                })
                                .catch((error) => {
                                    console.error('There was an error!', error);
                                    this.setHasSubmitErrors(true);
                                });
                        }
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
// export default observe<TProps>([], LoginView);

// function Login() {
//     const history = useHistory();
//     // TODO: fetch from state
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [hasSubmitErrors, setHasSubmitErrors] = useState(false);
//     // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/41674
//     const { from } = useLocation().state as any || { from: { pathname: '/' } };
//     const userSession = useContext(UserSessionContext);
//     const handleSubmit = () => {
//         if (username !== '' && password !== '') {
//             setHasSubmitErrors(false);
//             logon({
//                 username,
//                 password,
//             })
//                 .then(async (response) => {
//                     // set Access Token to AuthState
//                     // Decode JWT token
//                     // extract user uuid and fetch user roles
//                     // set auth info:
//                     // eslint-disable-next-line max-len
//                     // check for error response
//                     // TODO: set state
//                     if (response.accessToken) {
//                         userSession.setAuthenticated(response.accessToken);
//                         history.replace(from.pathname);
//                     }
//                 })
//                 .catch((error) => {
//                     console.error('There was an error!', error);
//                     setHasSubmitErrors(true);
//                 })
//                 .finally(() => {
//                     setPassword('');
//                 });
//         } else {
//             setHasSubmitErrors(true);
//         }
//     };
//     const renderAlert = () => {
//         if (!hasSubmitErrors) return null;
//         return (
//             <Alert severity="error">
//                 <Translate msg="Username and/or password is incorrect !" />
//             </Alert>
//         );
//     };
//     return (
//         <Container component="main" maxWidth="xs">
//             <Box
//                 display="flex"
//                 alignItems="center"
//                 justifyContent="center"
//                 flexDirection="column"
//                 marginTop="85px"
//             >
//                 <Typography component="h1" variant="h6">
//                     <IesiLogo title="iesiLogo" />
//                     IESI Automation
//                 </Typography>
//             </Box>
//             <TextInput
//                 id="username"
//                 label="username"
//                 margin="normal"
//                 required
//                 error={hasSubmitErrors && username === ''}
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//             />
//             <TextInput
//                 id="password"
//                 label="password"
//                 type="password"
//                 required
//                 error={hasSubmitErrors && password === ''}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//             />
//             {renderAlert()}
//             <Box textAlign="center" marginTop={5}>
//                 <Button
//                     variant="contained"
//                     size="medium"
//                     color="primary"
//                     disableElevation
//                     onClick={handleSubmit}
//                 >
//                     <Container component="main" maxWidth="xl">
//                         <Translate msg="login" />
//                     </Container>
//                 </Button>
//             </Box>
//         </Container>
//     );
// }
