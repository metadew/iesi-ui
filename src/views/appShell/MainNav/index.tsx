import React from 'react';
import { MAIN_NAV_ITEMS } from 'config/menu.config';
import NavLink from 'views/common/NavLink';

function MainNav() {
    return (
        <nav>
            <ul>
                {MAIN_NAV_ITEMS.map((item) => (
                    <li key={item.id}>
                        <NavLink
                            to={item.path}
                            exact={item.path === '/'}
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default MainNav;
