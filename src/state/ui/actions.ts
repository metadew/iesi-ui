import { createAction } from 'state';
import { StateChangeNotification } from 'models/state.models';
import { IFlashMessage } from 'models/state/ui.models';
import { SnackbarKey } from 'notistack';

export const triggerFlashMessage = (payload: IFlashMessage) => createAction<IFlashMessage>({
    type: 'TRIGGER_FLASH_MESSAGE',
    payload,
    process({ setStateImmutable, action }) {
        setStateImmutable({
            toState: (draftState) => {
                draftState.ui.flashMessages.push({
                    ...action.payload,
                    key: action.payload.key || new Date().getMilliseconds(),
                });
            },
            notificationsToTrigger: [StateChangeNotification.TRIGGER_FLASH_MESSAGE],
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
            notificationsToTrigger: [StateChangeNotification.CLOSE_FLASH_MESSAGE],
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
            notificationsToTrigger: [StateChangeNotification.REMOVE_FLASH_MESSAGE],
        });
    },
});
