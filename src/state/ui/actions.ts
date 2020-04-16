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
                    translationPlaceholders: action.payload.translationPlaceholders,
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
                const flashMessage = draftState.ui.flashMessages.find((item) => item.key === action.payload.key);
                if (flashMessage) {
                    flashMessage.dismissed = true;
                }
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
                const index = draftState.ui.flashMessages.findIndex((item) => item.key === action.payload.key);
                if (index !== -1) {
                    draftState.ui.flashMessages.splice(index, 1);
                }
            },
            notificationsToTrigger: [StateChangeNotification.FLASH_MESSAGES],
        });
    },
});
