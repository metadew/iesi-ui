import React from 'react';
import ReactDOM from 'react-dom';
import './views/assets/scss/global.scss';
import App from './views/appShell/App/index';
import * as serviceWorker from './serviceWorker';
import { ROOT_ELEMENT_ID } from './config/dom.config';

ReactDOM.render(
    <App />,
    document.getElementById(ROOT_ELEMENT_ID),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
