import React from 'react';
import { MAIN_NAV_ITEMS, IMenuItem } from 'config/menu.config';
import NavLink from 'views/common/NavLink';
import { observe, IObserveProps } from 'views/observe';
import { StateChangeNotification, IState } from 'models/state.models';
import { hasRequiredAccessLevels } from 'state/auth/selectors';
import ROUTES from 'views/routes';

function MainNav({ state }: IObserveProps) {
    return (
        <nav>
            <ul>
                {MAIN_NAV_ITEMS.map((item) => renderNavItem({ state, item }))}
            </ul>
        </nav>
    );
}

function renderNavItem({
    state,
    item,
}: {
    state: IState;
    item: IMenuItem;
}) {
    const { requiredAccessLevels } = ROUTES[item.routeKey];
    const allowedToRoute = hasRequiredAccessLevels(state, requiredAccessLevels);

    return allowedToRoute ? (
        <li key={item.id}>
            <NavLink
                to={item.path}
                exact={item.path === '/'}
            >
                {item.label}
            </NavLink>
        </li>
    ) : null;
}

export default observe(
    [StateChangeNotification.AUTH],
    MainNav,
);
