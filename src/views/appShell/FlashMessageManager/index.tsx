import React, { ReactElement } from 'react';
import { useSnackbar, SnackbarKey } from 'notistack';
import { observe, IObserveProps } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { getFlashMessages } from 'state/ui/selectors';
import { removeFlashMessage } from 'state/ui/actions';
import { IconButton } from '@material-ui/core';
import { Close, Visibility } from '@material-ui/icons';
import NavLink from 'views/common/NavLink';
import ROUTE_KEYS from 'routeKeys';
import ROUTES from 'views/routes';
import { getTranslator } from 'state/i18n/selectors';

/* implemented based on redux example: https://iamhosseindhv.com/notistack/demos#redux-/-mobx-example */

let displayedKeys: SnackbarKey[] = [];

function FlashMessageManager({
    state,
    dispatch,
}: IObserveProps): ReactElement {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const flashMessages = getFlashMessages(state);
    const translator = getTranslator(state);

    React.useEffect(() => {
        flashMessages.forEach((flashMessage) => {
            const {
                key, translationKey, options = {}, dismissed = false, navigateToRoute, translationPlaceholders,
            } = flashMessage;

            if (dismissed) {
                // dismiss snackbar using notistack
                closeSnackbar(key);
                return;
            }

            // do nothing if snackbar is already displayed
            if (displayedKeys.includes(key)) return;

            // display snackbar using notistack
            enqueueSnackbar(translator({ msg: translationKey, placeholders: translationPlaceholders }), {
                key,
                // Default values
                autoHideDuration: 1000 * 60,
                action: getActions({
                    onClose: () => closeSnackbar(key),
                    navigateToRoute,
                }),
                // Custom options
                ...options,
                onClose: (event, reason, myKey) => {
                    if (options.onClose) {
                        options.onClose(event, reason, myKey);
                    }
                },
                onExited: (event, myKey) => {
                    if (options.onExited) {
                        options.onExited(event, myKey);
                    }
                    // removen this snackbar from store
                    dispatch(removeFlashMessage({ key: myKey }));
                    removeDisplayed(myKey);
                },
            });

            // keep track of snackbars that we've displayed
            storeDisplayed(key);
        });
    }, [flashMessages, closeSnackbar, enqueueSnackbar, dispatch, translator]);

    return null;
}

function getActions({
    onClose,
    navigateToRoute,
}: {
    onClose: () => void;
    navigateToRoute: {
        routeKey: ROUTE_KEYS;
    };
}) {
    return (
        <>
            {navigateToRoute && navigateToRoute.routeKey && (
                renderRoute()
            )}
            <IconButton size="small" aria-label="close" color="inherit" onClick={onClose}>
                <Close fontSize="small" />
            </IconButton>
        </>
    );

    function renderRoute() {
        const route = ROUTES[navigateToRoute.routeKey];
        const { path, exact } = route;
        return (
            <NavLink to={path} exact={exact} flashMessageLink>
                <IconButton size="small" aria-label="close" color="inherit" onClick={onClose}>
                    <Visibility fontSize="small" />
                </IconButton>
            </NavLink>
        );
    }
}

function storeDisplayed(keyToAdd: SnackbarKey) {
    displayedKeys = [...displayedKeys, keyToAdd];
}

function removeDisplayed(keyToRemove: SnackbarKey) {
    displayedKeys = [...displayedKeys.filter((key) => keyToRemove !== key)];
}

export default observe(
    [StateChangeNotification.FLASH_MESSAGES, StateChangeNotification.I18N_TRANSLATIONS],
    FlashMessageManager,
);
