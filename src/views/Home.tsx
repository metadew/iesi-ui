import React from 'react';
import { Redirect } from 'react-router-dom';
import { getRoutePath, ROUTE_KEYS } from 'views/routes';

function Home() {
    return (
        <Redirect to={getRoutePath({ routeKey: ROUTE_KEYS.R_SCRIPTS })} />
    );
}

export default Home;
