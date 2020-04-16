import { createAction } from 'state';
import { StateChangeNotification } from 'models/state.models';
import { ITriggerFlashMessagePayload } from 'models/state/ui.models';
import { SnackbarKey } from 'notistack';

export const triggerFlashMessage = (payload: ITriggerFlashMessagePayload) => createAction<ITriggerFlashMessagePayload>({
    type: 'TRIGGER_FLASH_MESSAGE',
    payload,
    process({ setStateImmutable, action }) {
        setStateImmutable({
            toState: (draftState) => {
                const options = action.payload.options || {};
                draftState.ui.flashMessages.push({
                    translationKey: action.payload.translationKey,
                    navigateToRoute: action.payload.navigateToRoute,
                    options: {
                        ...options,
                        variant: action.payload.type || 'default',
                    },
                    dismissed: false,
                    key: new Date().getMilliseconds(),
                });
            },
            notificationsToTrigger: [StateChangeNotification.FLASH_MESSAGES],
        });
    },
});

export const closeFlashMessage = (payload: { key: SnackbarKey }) => createAction<{ key: SnackbarKey }>({
    type: 'CLOSE_FLASH_MESSAGE',
    payload,
    process({ setStateImmutable, action }) {
        setStateImmutable({
            toState: (draftState) => {
                // eslint-disable-next-line no-param-reassign
                draftState.ui.flashMessages = draftState.ui.flashMessages.map((flashMessage) => (
                    (!action.payload.key || flashMessage.key === action.payload.key)
                        ? { ...flashMessage, dismissed: true }
                        : { ...flashMessage }
                ));
            },
            notificationsToTrigger: [StateChangeNotification.FLASH_MESSAGES],
        });
    },
});

export const removeFlashMessage = (payload: { key: SnackbarKey }) => createAction<{ key: SnackbarKey }>({
    type: 'REMOVE_FLASH_MESSAGE',
    payload,
    process({ setStateImmutable, action }) {
        setStateImmutable({
            toState: (draftState) => {
                // eslint-disable-next-line no-param-reassign
                draftState.ui.flashMessages = draftState.ui.flashMessages
                    .filter((flashMessage) => flashMessage.key !== action.payload.key);
            },
            notificationsToTrigger: [StateChangeNotification.FLASH_MESSAGES],
        });
    },
});
