import React from 'react';
import {
    IconButton,
    Menu,
    MenuItem,
    makeStyles,
} from '@material-ui/core';
import { MenuRounded as MenuIcon } from '@material-ui/icons';
import { StateChangeNotification } from 'models/state.models';
import { IMenuItem, MAIN_NAV_ITEMS } from 'config/menu.config';
import { getRoute, redirectTo, ROUTE_KEYS } from 'views/routes';
import { checkAuthority, hasRequiredAccessLevels } from 'state/auth/selectors';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { IObserveProps, observe } from 'views/observe';
import { useLocation } from 'react-router-dom';
import getRouteMatchByPath from 'utils/navigation/getRouteMatchByPath';

const useStyles = makeStyles(({ palette }) => ({
    selected: {
        color: palette.primary.main,
    },
}));

function NavigationMenu({ state }: IObserveProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const location = useLocation();
    const classes = useStyles();

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigation = (routeKey: ROUTE_KEYS) => {
        redirectTo({ routeKey });
        handleClose();
    };
    return (
        <div>
            <IconButton
                aria-controls="toolbar-menu"
                aria-haspopup="true"
                onClick={handleOpen}
                style={{ fontSize: 'inherit' }}
            >
                <MenuIcon style={{ fontSize: 'inherit' }} />
            </IconButton>
            {location.pathname !== '/login'
                ? (
                    <Menu
                        id="toolbar-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={!!anchorEl}
                        onClose={handleClose}
                        disableAutoFocus
                        disableAutoFocusItem
                    >
                        {MAIN_NAV_ITEMS.flatMap((item) => (
                            checkAuthority(state, item.securityPrivilege) ? [renderNavItem(item)] : []
                        ))}
                    </Menu>
                )
                : null }
        </div>
    );

    function renderNavItem(item: IMenuItem) {
        console.log('ITEM: ', item.routeKey);
        const { routeKey, translationKey } = item;
        const { requiredAccessLevels } = getRoute({ routeKey });
        const { route: currentRoute } = getRouteMatchByPath(location.pathname);

        const isAllowedToRoute = hasRequiredAccessLevels(state, requiredAccessLevels);

        return isAllowedToRoute
            ? (
                <MenuItem
                    className={currentRoute.routeKey === routeKey ? classes.selected : ''}
                    onClick={() => handleNavigation(routeKey)}
                    key={`main-nav_${routeKey}`}
                >
                    <Translate msg={translationKey} />
                </MenuItem>
            )
            : null;
    }
}

export default observe(
    [StateChangeNotification.AUTH],
    NavigationMenu,
);
