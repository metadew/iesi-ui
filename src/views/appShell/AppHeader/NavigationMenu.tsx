import React from 'react';
import {
    IconButton,
    Menu,
    MenuItem,
} from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { StateChangeNotification } from 'models/state.models';
import { IMenuItem, MAIN_NAV_ITEMS } from 'config/menu.config';
import { getRoute } from 'views/routes';
import { hasRequiredAccessLevels } from 'state/auth/selectors';
import RouteLink from 'views/common/navigation/RouteLink';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { IObserveProps, observe } from 'views/observe';

function NavigationMenu({ state }: IObserveProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton aria-controls="toolbar-menu" aria-haspopup="true" onClick={handleClick}>
                <MenuIcon />
            </IconButton>
            <Menu
                id="toolbar-menu"
                anchorEl={anchorEl}
                keepMounted
                open={!!anchorEl}
                onClose={handleClose}
            >
                {MAIN_NAV_ITEMS.map(renderNavItem)}
            </Menu>
        </div>
    );

    function renderNavItem(item: IMenuItem) {
        const { routeKey, translationKey } = item;
        const { exact, requiredAccessLevels } = getRoute({ routeKey });
        const isAllowedToRoute = hasRequiredAccessLevels(state, requiredAccessLevels);

        return isAllowedToRoute
            ? (
                <MenuItem key={`main-nav_${routeKey}`}>
                    <RouteLink
                        to={routeKey}
                        exact={exact}
                    >
                        <Translate msg={translationKey} />
                    </RouteLink>
                </MenuItem>
            )
            : null;
    }
}

export default observe(
    [StateChangeNotification.AUTH],
    NavigationMenu,
);
