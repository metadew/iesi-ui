/* eslint-disable react/no-unused-state */
/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import SignIn from '.';
import AppTemplate from '../AppTemplate';

export class SignInDirectoryClass extends Component {
    constructor() {
        super(null);
        console.log('test');

        this.state = {
            loggedInStatus: 'NOT_LOGGED_IN',
            user: {},
        };
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route
                        path="/scripts"
                        exact
                        render={(props) => (
                            <AppTemplate {...props} loggedInStatus={this.state.loggedInStatus} />
                        )}
                    />
                    <Route path="/signin" exact component={SignIn} />
                </Switch>
            </Router>
        );
    }
}


export default function SignInDirectory() {
    return (
        <Router>
            <Switch>
                <Route path="/scripts" exact component={AppTemplate} />
                <Route path="/signin" exact component={SignIn} />
            </Switch>
        </Router>
    );
}
