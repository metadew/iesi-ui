import { SnackbarMessage, OptionsObject, SnackbarKey } from 'notistack';
import ROUTE_KEYS from 'routeKeys';

export interface IUiState {
    flashMessages: IFlashMessage[];
}

export interface IFlashMessage {
    msg: SnackbarMessage;
    options?: OptionsObject;
    dismissed?: boolean;
    key?: SnackbarKey;
    navigateToRoute?: {
        routeKey: ROUTE_KEYS;
    };
}
