import React, { useEffect } from 'react';
import { ROUTE_KEYS, redirectTo } from 'views/routes';

function Home() {
    useEffect(() => {
        redirectTo({ routeKey: ROUTE_KEYS.R_SCRIPTS });
    }, []);

    return (
        <div />
    );
}

export default Home;
