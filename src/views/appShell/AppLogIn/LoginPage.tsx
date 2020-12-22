import React, { useContext, useState } from 'react';
import { Button, Container, Typography, Box } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import TextInput from 'views/common/input/TextInput';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { Alert } from '@material-ui/lab';
import { ReactComponent as IesiLogo } from './logo.svg';
import { UserSessionContext } from './contexts/UserSessionContext';
import { logon } from '../../../api/security/security.api';

function Login() {
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [hasSubmitErrors, setHasSubmitErrors] = useState(false);
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/41674
    const { from } = useLocation().state as any || { from: { pathname: '/' } };
    const userSession = useContext(UserSessionContext);

    const handleSubmit = () => {
        if (username !== '' && password !== '') {
            setHasSubmitErrors(false);
            logon({
                username,
                password,
            })
                .then(async (response) => {
                    // eslint-disable-next-line max-len
                    // check for error response
                    if (response.accessToken) {
                        console.log(from);
                        userSession.setAuthenticated(response.accessToken);
                        history.replace(from.pathname);
                    }
                })
                .catch((error) => {
                    console.error('There was an error!', error);
                })
                .finally(() => {
                    setPassword('');
                    setHasSubmitErrors(true);
                });
        }
    };

    const renderAlert = () => {
        if (!hasSubmitErrors) return null;
        return (
            <Alert severity="error">
                <Translate msg="Username and/or password is incorrect !" />
            </Alert>
        );
    };

    return (
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
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextInput
                id="password"
                label="password"
                type="password"
                required
                error={hasSubmitErrors && password === ''}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {renderAlert()}
            <Box textAlign="center" marginTop={5}>
                <Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    disableElevation
                    onClick={handleSubmit}
                >
                    <Container component="main" maxWidth="xl">
                        <Translate msg="login" />
                    </Container>
                </Button>
            </Box>
        </Container>
    );
}

export default Login;
