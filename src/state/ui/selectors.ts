import { IState } from 'models/state.models';

export const getFlashMessages = (state: IState) => state.ui.flashMessages;
