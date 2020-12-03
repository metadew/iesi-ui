/* eslint-disable linebreak-style */
import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import SignIn from '.';
import AppTemplate from '../AppTemplate';

export default function SignInDirectory() {
    const userSession = {
        name: 'null',
        password: 'null',
    };
    if (userSession.name === 'null') {
        console.log('catch');
    }
    return (
        <Router>
            <Switch>
                <Route path="/signin" exact component={SignIn}>
                    <SignIn />
                </Route>
                <Route path="/scripts" exact component={AppTemplate}>
                    <AppTemplate />
                </Route>
            </Switch>
        </Router>
    );
}
