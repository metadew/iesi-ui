import React, { useContext } from 'react';
import { TextField, Button, Container, Typography, Box } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik } from 'formik';
import { object, string } from 'yup';
// import * as Yup from 'yup';
import { triggerFlashMessage } from 'state/ui/actions';
import { ReactComponent as IesiLogo } from './logo.svg';
import { UserSessionContext } from './contexts/UserSessionContext';
import { logon } from '../../../api/security/security.api';


function Login() {
    const history = useHistory();

    // Cast to any is required due to
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/41674
    const { from } = useLocation().state as any || { from: { pathname: '/' } };
    const userSession = useContext(UserSessionContext);

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
            <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={object({
                    username: string()
                        .max(15, 'Must be 15 characters or less')
                        .required('Required'),
                    password: string()
                        .required('Required'),
                })}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        logon({
                            username: values.username,
                            password: values.password,
                        })
                            .then(async (response) => {
                                // eslint-disable-next-line max-len
                                triggerFlashMessage({ translationKey: 'username or/and password incorrect !' });
                                // check for error response
                                console.log(response);
                                if (response.accessToken) {
                                    console.log(from);
                                    userSession.setAuthenticated(response.accessToken);
                                    history.replace(from.pathname);
                                }
                            })
                            .catch((error) => {
                                // this.setState({ errorMessage: error });
                                console.error('There was an error!', error);
                                triggerFlashMessage({ translationKey: 'username or/and password incorrect !' });
                            })
                            .finally(() => {
                                setSubmitting(false);
                            });
                        // fetch(`${iesiApiBaseUrl}//localhost:8080/api/users/login`, requestOptions)
                        //     // eslint-disable-next-line consistent-return
                        //     .then(async (response) => {
                        //         const data = await response.json();
                        //         // eslint-disable-next-line max-len
                        //         triggerFlashMessage({ translationKey: 'username or/and password incorrect !' });
                        //         console.log(process.env.PUBLIC_URL);
                        //         // check for error response
                        //         if (!response.ok) {
                        //             // get error message from body or default to response status
                        //             const error = (data && data.message) || response.status;
                        //             return Promise.reject(error);
                        //         }
                        //         console.log(from);
                        //         userSession.setAuthenticated(data.accessToken);
                        //         history.replace('/scripts');
                        //     })
                        //     .catch((error) => {
                        //         // this.setState({ errorMessage: error });
                        //         console.error('There was an error!', error);
                        //     })
                        //     .finally(() => {
                        //         setSubmitting(false);
                        //     });
                    }, 400);
                }}
            >
                {({
                    values,
                    // eslint-disable-next-line no-shadow
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    /* and other goodies */
                }) => (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            id="username"
                            label="Username"
                            name="username"
                            value={values.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            margin="normal"
                            variant="outlined"
                            required
                            autoComplete="username"
                            fullWidth
                            color="primary"
                        />
                        <TextField
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            margin="normal"
                            variant="outlined"
                            required
                            autoComplete="password"
                            fullWidth
                            color="primary"
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Log in
                        </Button>
                    </form>
                )}
            </Formik>
        </Container>
    );
}

export default Login;
