import React from 'react';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { StateChangeNotification, IState } from 'models/state.models';
import { MAIN_NAV_ITEMS, IMenuItem } from 'config/menu.config';
import { hasRequiredAccessLevels } from 'state/auth/selectors';
import { getRoute } from 'views/routes';
import { observe, IObserveProps } from 'views/observe';
import NavLink from 'views/common/navigation/NavLink';

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
    const { routeKey, translationKey } = item;
    const { path, exact, requiredAccessLevels } = getRoute({ routeKey });
    const isAllowedToRoute = hasRequiredAccessLevels(state, requiredAccessLevels);

    return isAllowedToRoute
        ? (
            <li key={`main-nav_${routeKey}`}>
                <NavLink
                    to={path}
                    exact={exact}
                >
                    <Translate msg={translationKey} />
                </NavLink>
            </li>
        )
        : null;
}

export default observe(
    [StateChangeNotification.AUTH],
    MainNav,
);
