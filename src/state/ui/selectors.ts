import { IState } from 'models/state.models';

export const getFlashMessages = (state: IState) => state.ui.flashMessages;
export const getAccessToken = (state: IState) => state.auth.accessToken;

export const getScriptsListFilter = (state: IState) => state.ui.listFilters.scripts;
export const getExecutionsListFilter = (state: IState) => state.ui.listFilters.executions;
export const getComponentsListFilter = (state: IState) => state.ui.listFilters.components;
export const getConnectionsListFilter = (state: IState) => state.ui.listFilters.connections;
export const getEnvironmentsListFilter = (state: IState) => state.ui.listFilters.environments;
export const getDatasetsListFilter = (state: IState) => state.ui.listFilters.datasets;
export const getUsersListFilter = (state: IState) => state.ui.listFilters.users;
export const getTeamsListFilter = (state: IState) => state.ui.listFilters.teams;
export const getSecurityGroupsListFilter = (state: IState) => state.ui.listFilters.securityGroups;
