import React from 'react';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { IState, StateChangeNotification } from 'models/state.models';
import { IMenuItem, MAIN_NAV_ITEMS } from 'config/menu.config';
import { hasRequiredAccessLevels } from 'state/auth/selectors';
import { getRoute } from 'views/routes';
import { IObserveProps, observe } from 'views/observe';
import RouteLink from 'views/common/navigation/RouteLink';

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
    const { exact, requiredAccessLevels } = getRoute({ routeKey });
    const isAllowedToRoute = hasRequiredAccessLevels(state, requiredAccessLevels);

    return isAllowedToRoute
        ? (
            <li key={`main-nav_${routeKey}`}>
                <RouteLink
                    to={routeKey}
                    exact={exact}
                >
                    <Translate msg={translationKey} />
                </RouteLink>
            </li>
        )
        : null;
}

export default observe(
    [StateChangeNotification.AUTH],
    MainNav,
);
