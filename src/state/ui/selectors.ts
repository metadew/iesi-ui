import { IState } from 'models/state.models';

export const getFlashMessages = (state: IState) => state.ui.flashMessages;

export const getScriptsListFilter = (state: IState) => state.ui.listFilters.scripts;
