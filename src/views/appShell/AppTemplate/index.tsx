import React, { useState, useCallback } from 'react';
import { Box } from '@material-ui/core';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import ShowAfterEnvConfigKnown from '../ShowAfterEnvConfigKnown';
import ThemeProvider from '../ThemeProvider';
import FlashMessages from '../FlashMessages';
import AppHeader from '../AppHeader';
import AppBody from '../AppBody';
import SignIn from '../AppSignIn';

export default function AppTemplate() {
    const [height, setHeight] = useState(0);

    const measuredRef = useCallback((node) => {
        if (node !== null) {
            setHeight(node.getBoundingClientRect().height);
        }
    }, []);

    const userSession = {
        name: 'null',
        password: 'null',
    };
    if (userSession.name === 'null') {
        console.log('catch');
    }

    return (
        <ShowAfterEnvConfigKnown>
            <Router>
                <Switch>
                    <Route path="/signin" exact component={SignIn}>
                        <SignIn />
                    </Route>
                    <Route path="/scripts" exact component={AppTemplate}>
                        <ThemeProvider
                            render={(renderProps) => (
                                <Box height="100%">
                                    <div>
                                        <FlashMessages />
                                    </div>
                                    <Box
                                        position="relative"
                                        display="flex"
                                        flexDirection="column"
                                        minHeight="100%"
                                    >
                                        <AppHeader
                                            toggleTheme={renderProps.toggleTheme}
                                            currentTheme={renderProps.currentTheme}
                                            forwardRef={measuredRef}
                                        />
                                        <AppBody offsetTop={Math.round(height)} />
                                    </Box>
                                </Box>
                            )}
                        />
                    </Route>
                </Switch>
            </Router>
        </ShowAfterEnvConfigKnown>
    );
}
