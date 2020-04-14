import React from 'react';
import { Redirect } from 'react-router-dom';
// import ROUTES from 'views/routes'; => dep cycle

// Use the design route as "Homepage"
function Home() {
    return (
        // <Redirect to={ROUTES.R_DESIGN.path} />
        <Redirect to="/design" />
    );
}

export default Home;
