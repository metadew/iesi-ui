import React, { ReactElement } from 'react';
import { useSnackbar, SnackbarKey } from 'notistack';
import { observe, IObserveProps } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { getFlashMessages } from 'state/ui/selectors';
import { removeFlashMessage } from 'state/ui/actions';
import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';

/* implemented based on redux example: https://iamhosseindhv.com/notistack/demos#redux-/-mobx-example */

let displayedKeys: SnackbarKey[] = [];

function FlashMessageManager({
    state,
    dispatch,
}: IObserveProps): ReactElement {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const flashMessages = getFlashMessages(state);

    React.useEffect(() => {
        const closeAction = (key: string) => (
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => closeSnackbar(key)}>
                <Close fontSize="small" />
            </IconButton>
        );

        flashMessages.forEach(({ key, msg, options = {}, dismissed = false }) => {
            if (dismissed) {
                // dismiss snackbar using notistack
                closeSnackbar(key);
                return;
            }

            // do nothing if snackbar is already displayed
            if (displayedKeys.includes(key)) return;

            // display snackbar using notistack
            enqueueSnackbar(msg, {
                key,
                // Default values
                autoHideDuration: 1000 * 60,
                action: closeAction,
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
    }, [flashMessages, closeSnackbar, enqueueSnackbar, dispatch]);

    return null;
}

function storeDisplayed(keyToAdd: SnackbarKey) {
    displayedKeys = [...displayedKeys, keyToAdd];
}

function removeDisplayed(keyToRemove: SnackbarKey) {
    displayedKeys = [...displayedKeys.filter((key) => keyToRemove !== key)];
}

export default observe(
    [StateChangeNotification.FLASH_MESSAGES],
    FlashMessageManager,
);
