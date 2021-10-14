import { IState } from 'models/state.models';

export const getFlashMessages = (state: IState) => state.ui.flashMessages;

export const getScriptsListFilter = (state: IState) => state.ui.listFilters.scripts;
export const getExecutionsListFilter = (state: IState) => state.ui.listFilters.executions;
export const getComponentsListFilter = (state: IState) => state.ui.listFilters.components;
export const getConnectionsListFilter = (state: IState) => state.ui.listFilters.connections;
