import { SnackbarMessage, OptionsObject, SnackbarKey } from 'notistack';

export interface IUiState {
    flashMessages: IFlashMessage[];
}

export interface IFlashMessage {
    msg: SnackbarMessage;
    options?: OptionsObject;
    dismissed?: boolean;
    key?: SnackbarKey;
}
