import React from 'react';
import './app.scss';
import NavLink from '../../common/NavLink';
import { ROUTES } from '../../routes';

function Nav() {
    return (
        <nav>
            <ul>
                <li><NavLink route={ROUTES.CURRENT_INDEX_PAGE}>Home</NavLink></li>
                <li><NavLink route={ROUTES.DASHBOARD}>Dashboard</NavLink></li>
                <li><NavLink route={ROUTES.ABOUT}>About</NavLink></li>
                <li><NavLink route="test">Not found</NavLink></li>
                <li><NavLink route={ROUTES.REACT_START_PAGE}>React start page</NavLink></li>
            </ul>
        </nav>
    );
}

export default Nav;
