/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext } from 'react';
// eslint-disable-next-line max-len
import { TextField, Button, Container, Typography, FormGroup, FormControlLabel, Checkbox, Box, makeStyles, createStyles, Theme } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ReactComponent as IesiLogo } from './logo.svg';
import { UserSessionContext } from './contexts/UserSessionContext';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        logo: {
            height: 65,
            width: 65,
            padding: 10,
        },
    }));

function Login() {
    const history = useHistory();

    // Cast to any is required due to
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/41674
    const { from } = useLocation().state as any || { from: { pathname: '/' } };
    const userSession = useContext(UserSessionContext);

    const [checked, setChecked] = React.useState(false);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    const classes = useStyles();
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
                validationSchema={Yup.object({
                    username: Yup.string()
                        .max(15, 'Must be 15 characters or less')
                        .required('Required'),
                    password: Yup.string()
                        .required('Required'),
                })}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(values, null, 2),
                        };

                        const { protocol } = window.location;

                        fetch(`${protocol}//localhost:8080/api/users/login`, requestOptions)
                            // eslint-disable-next-line consistent-return
                            .then(async (response) => {
                                const data = await response.json();

                                // check for error response
                                if (!response.ok) {
                                    // get error message from body or default to response status
                                    const error = (data && data.message) || response.status;
                                    // add FlashMessage to tell user incorrect pwd or username
                                    return Promise.reject(error);
                                }
                                console.log(from);
                                userSession.setAuthenticated(data.accessToken);
                                history.replace('/scripts');
                            })
                            .catch((error) => {
                                // this.setState({ errorMessage: error });
                                console.error('There was an error!', error);
                            })
                            .finally(() => {
                                setSubmitting(false);
                            });
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
