import { createAction, getStore } from 'state';
import { StateChangeNotification } from 'models/state.models';
import { ISortedColumn, ListFilters } from 'models/list.models';
import { ITriggerFlashMessagePayload } from 'models/state/ui.models';
import { SnackbarKey } from 'notistack';
import { isExecutionRequestStatusPending } from 'utils/scripts/executionRequests';
import { ROUTE_KEYS } from 'views/routes';
import { IColumnNames as IScriptsColumnNames } from 'models/state/scripts.models';
import { IColumnNames as IExecutionsColumnNames } from 'models/state/executionRequests.models';
import { getUniqueIdFromConnection } from 'utils/connections/connectionUtils';
import { getUniqueIdFromComponent } from 'utils/components/componentUtils';
import { ReactText } from 'react';
import { IConnection, IConnectionColumnNamesBase } from 'models/state/connections.model';
import { IComponent, IComponentColumnNamesBase } from 'models/state/components.model';
import { IDatasetColumnNames, IDatasetImplementation } from 'models/state/datasets.model';
import { IUserColumnName } from 'models/state/user.model';
import { ITeamColumnNames } from 'models/state/team.model';
import { ISecurityGroupColumnNames } from 'models/state/securityGroups.model';
import { ITemplateColumnNames } from 'models/state/templates.model';
import { IEnvironmentColumnNamesBase } from 'models/state/environments.models';

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

export const addPollingExecutionRequest = (payload: { id: string }) => createAction<{ id: string }>({
    type: 'ADD_POLLING_EXECUTION_REQUEST',
    payload,
    process({ setStateImmutable, action }) {
        setStateImmutable({
            toState: (draftState) => {
                draftState.ui.pollingExecutionRequestIds.push(action.payload.id);
            },
            notificationsToTrigger: [StateChangeNotification.POLLING_EXECUTION_REQUESTS],
        });
    },
});

export const removePollingExecutionRequest = (payload: { id: string }) => createAction<{ id: string }>({
    type: 'REMOVE_POLLING_EXECUTION_REQUEST',
    payload,
    process({ setStateImmutable, action }) {
        setStateImmutable({
            toState: (draftState) => {
                const index = draftState.ui.pollingExecutionRequestIds.findIndex((id) => id === action.payload.id);
                if (index !== -1) {
                    draftState.ui.pollingExecutionRequestIds.splice(index, 1);
                }
            },
            notificationsToTrigger: [StateChangeNotification.POLLING_EXECUTION_REQUESTS],
        });
    },
});

export const checkPollingExecutionRequests = () => createAction<{}>({
    type: 'CHECK_POLLING_EXECUTION_REQUESTS',
    payload: {},
    async process({ getState, api }) {
        const { dispatch } = getStore();
        try {
            const state = getState();
            await state.ui.pollingExecutionRequestIds.forEach(async (id) => {
                const executionRequestData = await api.executionRequests.fetchExecutionRequest({ id });
                if (!isExecutionRequestStatusPending(executionRequestData.executionRequestStatus)) {
                    dispatch(triggerFlashMessage({
                        translationKey: 'flash_messages.execution_request.run_finished',
                        translationPlaceholders: {
                            scriptName: executionRequestData.name,
                        },
                        type: 'info',
                        navigateToRoute: {
                            routeKey: ROUTE_KEYS.R_REPORT_DETAIL,
                            params: { executionRequestId: id },
                        },
                    }));
                    dispatch(removePollingExecutionRequest({ id }));
                }
            });
        } catch (error) {
            dispatch(triggerFlashMessage({ translationKey: 'error.fetch_env', type: 'error' }));
        }
    },
});

export const setScriptsListFilter = (payload: {
    filters?: ListFilters<Partial<IScriptsColumnNames>>;
    onlyShowLatestVersion?: boolean;
    page?: number;
    sortedColumn?: ISortedColumn<IScriptsColumnNames>;
}) => createAction<{
    filters?: ListFilters<Partial<IScriptsColumnNames>>;
    onlyShowLatestVersion?: boolean;
    page?: number;
    sortedColumn?: ISortedColumn<IScriptsColumnNames>;
}>({
    type: 'UPDATE_SCRIPTS_LIST_FILTER',
    payload,
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                // eslint-disable-next-line no-param-reassign
                draftState.ui.listFilters.scripts = {
                    filters: payload.filters || draftState.ui.listFilters.scripts.filters,
                    onlyShowLatestVersion: typeof payload.onlyShowLatestVersion !== 'undefined'
                        ? payload.onlyShowLatestVersion
                        : draftState.ui.listFilters.scripts.onlyShowLatestVersion,
                    page: payload.page || draftState.ui.listFilters.scripts.page,
                    sortedColumn: payload.sortedColumn || draftState.ui.listFilters.scripts.sortedColumn,
                };
            },
            notificationsToTrigger: [StateChangeNotification.LIST_FILTER_SCRIPTS],
        });
    },
});

export const setExecutionsListFilter = (payload: {
    filters?: ListFilters<Partial<IExecutionsColumnNames>>;
    page?: number;
    sortedColumn?: ISortedColumn<IExecutionsColumnNames>;
}) => createAction<{
    filters?: ListFilters<Partial<IExecutionsColumnNames>>;
    page?: number;
    sortedColumn?: ISortedColumn<IExecutionsColumnNames>;
}>({
    type: 'UPDATE_EXECUTIONS_LIST_FILTER',
    payload,
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                // eslint-disable-next-line no-param-reassign
                draftState.ui.listFilters.executions = {
                    filters: payload.filters || draftState.ui.listFilters.executions.filters,
                    page: payload.page || draftState.ui.listFilters.executions.page,
                    sortedColumn: payload.sortedColumn || draftState.ui.listFilters.executions.sortedColumn,
                };
            },
            notificationsToTrigger: [StateChangeNotification.LIST_FILTER_EXECUTIONS],
        });
    },
});

export const setComponentsListFilter = (payload: {
    filters?: ListFilters<Partial<IComponentColumnNamesBase>>;
    onlyShowLatestVersion?: boolean;
    page?: number;
    sortedColumn?: ISortedColumn<IComponentColumnNamesBase>;
}) => createAction<{
    filters?: ListFilters<Partial<IComponentColumnNamesBase>>;
    onlyShowLatestVersion?: boolean;
    page?: number;
    sortedColumn?: ISortedColumn<IComponentColumnNamesBase>;
}>({
    type: 'UPDATE_COMPONENTS_LIST_FILTER',
    payload,
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                // eslint-disable-next-line no-param-reassign
                draftState.ui.listFilters.components = {
                    filters: payload.filters || draftState.ui.listFilters.components.filters,
                    onlyShowLatestVersion: typeof payload.onlyShowLatestVersion !== 'undefined'
                        ? payload.onlyShowLatestVersion
                        : draftState.ui.listFilters.components.onlyShowLatestVersion,
                    page: payload.page || draftState.ui.listFilters.components.page,
                    sortedColumn: payload.sortedColumn || draftState.ui.listFilters.components.sortedColumn,
                };
            },
            notificationsToTrigger: [StateChangeNotification.LIST_FILTER_COMPONENTS],
        });
    },
});

export const setConnectionsListFilter = (payload: {
    filters?: ListFilters<Partial<IConnectionColumnNamesBase>>;
    page?: number;
    sortedColumn?: ISortedColumn<IConnectionColumnNamesBase>;
}) => createAction<{
    filters?: ListFilters<Partial<IConnectionColumnNamesBase>>;
    page?: number;
    sortedColumn?: ISortedColumn<IConnectionColumnNamesBase>;
}>({
    type: 'UPDATE_CONNECTIONS_LIST_FILTER',
    payload,
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                // eslint-disable-next-line no-param-reassign
                draftState.ui.listFilters.connections = {
                    filters: payload.filters || draftState.ui.listFilters.connections.filters,
                    page: payload.page || draftState.ui.listFilters.connections.page,
                    sortedColumn: payload.sortedColumn || draftState.ui.listFilters.connections.sortedColumn,
                };
            },
            notificationsToTrigger: [StateChangeNotification.LIST_FILTER_COMPONENTS],
        });
    },
});

export const setDatasetsListFilter = (payload: {
    filters?: ListFilters<Partial<IDatasetColumnNames>>;
    onlyShowLatestVersion?: boolean;
    page?: number;
    sortedColumn?: ISortedColumn<IDatasetColumnNames>;
}) => createAction<{
    filters?: ListFilters<Partial<IDatasetColumnNames>>;
    onlyShowLatestVersion?: boolean;
    page?: number;
    sortedColumn?: ISortedColumn<IDatasetColumnNames>;
}>({
    type: 'UPDATE_DATASETS_LIST_FILTER',
    payload,
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                // eslint-disable-next-line no-param-reassign
                draftState.ui.listFilters.datasets = {
                    filters: payload.filters || draftState.ui.listFilters.datasets.filters,
                    page: payload.page || draftState.ui.listFilters.datasets.page,
                    sortedColumn: payload.sortedColumn || draftState.ui.listFilters.datasets.sortedColumn,
                };
            },
            notificationsToTrigger: [StateChangeNotification.LIST_FILTER_DATASETS],
        });
    },
});

export const setEnvironmentsListFilter = (payload: {
    filters?: ListFilters<Partial<IEnvironmentColumnNamesBase>>;
    page?: number;
    sortedColumn?: ISortedColumn<IEnvironmentColumnNamesBase>;
}) => createAction<{
    filters?: ListFilters<Partial<IEnvironmentColumnNamesBase>>;
    page?: number;
    sortedColumn?: ISortedColumn<IEnvironmentColumnNamesBase>;
}>({
    type: 'UPDATE_ENVIRONMENTS_LIST_FILTER',
    payload,
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                // eslint-disable-next-line no-param-reassign
                draftState.ui.listFilters.environments = {
                    filters: payload.filters || draftState.ui.listFilters.environments.filters,
                    page: payload.page || draftState.ui.listFilters.environments.page,
                    sortedColumn: payload.sortedColumn || draftState.ui.listFilters.environments.sortedColumn,
                };
            },
            notificationsToTrigger: [StateChangeNotification.LIST_FILTER_ENVIRONMENTS],
        });
    },
});

export const setUsersListFilter = (payload: {
    filters?: ListFilters<Partial<IUserColumnName>>;
    page?: number;
    sortedColumn?: ISortedColumn<IUserColumnName>;
}) => createAction<{
    filters?: ListFilters<Partial<IUserColumnName>>;
    page?: number;
    sortedColumn?: ISortedColumn<IUserColumnName>;
}>({
    type: 'UPDATE_USERS_LIST_FILTER',
    payload,
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                // eslint-disable-next-line no-param-reassign
                draftState.ui.listFilters.users = {
                    filters: payload.filters || draftState.ui.listFilters.users.filters,
                    page: payload.page || draftState.ui.listFilters.users.page,
                    sortedColumn: payload.sortedColumn || draftState.ui.listFilters.users.sortedColumn,
                };
            },
            notificationsToTrigger: [StateChangeNotification.LIST_FILTER_USERS],
        });
    },
});

export const setTeamsListFilter = (payload: {
    filters?: ListFilters<Partial<ITeamColumnNames>>;
    page?: number;
    sortedColumn?: ISortedColumn<ITeamColumnNames>;
}) => createAction<{
    filters?: ListFilters<Partial<ITeamColumnNames>>;
    page?: number;
    sortedColumn?: ISortedColumn<ITeamColumnNames>;
}>({
    type: 'UPDATE_TEAMS_LIST_FILTER',
    payload,
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                // eslint-disable-next-line no-param-reassign
                draftState.ui.listFilters.teams = {
                    filters: payload.filters || draftState.ui.listFilters.teams.filters,
                    page: payload.page || draftState.ui.listFilters.teams.page,
                    sortedColumn: payload.sortedColumn || draftState.ui.listFilters.teams.sortedColumn,
                };
            },
            notificationsToTrigger: [StateChangeNotification.LIST_FILTER_TEAMS],
        });
    },
});

export const setSecurityGroupsListFilter = (payload: {
    filters?: ListFilters<Partial<ISecurityGroupColumnNames>>;
    page?: number;
    sortedColumn?: ISortedColumn<ISecurityGroupColumnNames>;
}) => createAction<{
    filters?: ListFilters<Partial<ISecurityGroupColumnNames>>;
    page?: number;
    sortedColumn?: ISortedColumn<ISecurityGroupColumnNames>;
}>({
    type: 'UPDATE_SECURITY_GROUPS_LIST_FILTER',
    payload,
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                // eslint-disable-next-line no-param-reassign
                draftState.ui.listFilters.securityGroups = {
                    filters: payload.filters || draftState.ui.listFilters.securityGroups.filters,
                    page: payload.page || draftState.ui.listFilters.securityGroups.page,
                    sortedColumn: payload.sortedColumn || draftState.ui.listFilters.securityGroups.sortedColumn,
                };
            },
            notificationsToTrigger: [StateChangeNotification.LIST_FILTER_SECURITY_GROUPS],
        });
    },
});

export const setTemplatesListFilter = (payload: {
    filters?: ListFilters<Partial<ITemplateColumnNames>>;
    page?: number;
    sortedColumn?: ISortedColumn<ITemplateColumnNames>;
    onlyShowLatestVersion?: boolean;
}) => createAction<{
    filters?: ListFilters<Partial<ITemplateColumnNames>>;
    page?: number;
    sortedColumn?: ISortedColumn<ITemplateColumnNames>;
    onlyShowLatestVersion?: boolean;
}>({
    type: 'UPDATE_TEMPLATES_LIST_FILTER',
    payload,
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                // eslint-disable-next-line no-param-reassign
                draftState.ui.listFilters.templates = {
                    filters: payload.filters || draftState.ui.listFilters.templates.filters,
                    page: payload.page || draftState.ui.listFilters.templates.page,
                    sortedColumn: payload.sortedColumn || draftState.ui.listFilters.templates.sortedColumn,
                    onlyShowLatestVersion: typeof payload.onlyShowLatestVersion !== 'undefined'
                        ? payload.onlyShowLatestVersion
                        : draftState.ui.listFilters.templates.onlyShowLatestVersion,
                };
            },
            notificationsToTrigger: [StateChangeNotification.LIST_FILTER_TEMPLATES],
        });
    },
});

export const handleConnection = (payload: {
    currentConnection: IConnection;
}) => createAction<{
    currentConnection: IConnection;
}>({
    type: 'CONNECTION.HANDLE',
    payload,
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                const { currentConnection } = payload;
                const { connections } = draftState.entities.openapi.data;
                const currentConnectionId = getUniqueIdFromConnection(currentConnection);
                // eslint-disable-next-line no-param-reassign
                draftState.entities.openapi.data.connections = connections
                    .map((connection) => (getUniqueIdFromConnection(connection) === currentConnectionId
                        ? { ...connection, isHandled: true }
                        : connection
                    ));
            },
            notificationsToTrigger: [StateChangeNotification.HANDLE],
        });
    },
});

export const deleteConnection = (payload: { id: ReactText }) => createAction<{ id: ReactText }>({
    type: 'CONNECTION.DELETE',
    payload,
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                const { connections } = draftState.entities.openapi.data;
                // eslint-disable-next-line no-param-reassign
                draftState.entities.openapi.data.connections = connections
                    .filter((connection) => getUniqueIdFromConnection(connection) !== payload.id);
            },
            notificationsToTrigger: [StateChangeNotification.CONNECTION_DELETE],
        });
    },
});

export const deleteComponent = (payload: { id: ReactText }) => createAction<{ id: ReactText }>({
    type: 'COMPONENT.DELETE',
    payload,
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                const { components } = draftState.entities.openapi.data;
                // eslint-disable-next-line no-param-reassign
                draftState.entities.openapi.data.components = components
                    .filter((component) => getUniqueIdFromComponent(component) !== payload.id);
            },
            notificationsToTrigger: [StateChangeNotification.COMPONENT_DELETE],
        });
    },
});

export const handleComponent = (payload: {
    currentComponent: IComponent;
}) => createAction<{
    currentComponent: IComponent;
}>({
    type: 'COMPONENT.HANDLE',
    payload,
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                const { currentComponent } = payload;
                const { components } = draftState.entities.openapi.data;
                const currentComponentId = getUniqueIdFromComponent(currentComponent);
                // eslint-disable-next-line no-param-reassign
                draftState.entities.openapi.data.components = components
                    .map((component) => (getUniqueIdFromComponent(component) === currentComponentId
                        ? { ...component, isHandled: true }
                        : component
                    ));
            },
            notificationsToTrigger: [StateChangeNotification.HANDLE],
        });
    },
});

export const editConnection = (payload: {
    newConnection: IConnection;
    currentConnection: IConnection;
}) => createAction<{
    newConnection: IConnection;
    currentConnection: IConnection;
}>({
    type: 'CONNECTION.EDIT',
    payload,
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                const { currentConnection, newConnection } = payload;
                const { connections } = draftState.entities.openapi.data;
                const currentConnectionId = getUniqueIdFromConnection(currentConnection);
                // eslint-disable-next-line no-param-reassign
                draftState.entities.openapi.data.connections = connections
                    .map((connection) => (getUniqueIdFromConnection(connection) === currentConnectionId
                        ? newConnection
                        : connection
                    ));
            },
            notificationsToTrigger: [StateChangeNotification.CONNECTION_EDIT],
        });
    },
});

export const editComponent = (payload: {
    newComponent: IComponent;
    currentComponent: IComponent;
}) => createAction<{
    newComponent: IComponent;
    currentComponent: IComponent;
}>({
    type: 'COMPONENT.EDIT',
    payload,
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                const { currentComponent, newComponent } = payload;
                const { components } = draftState.entities.openapi.data;
                const currentComponentId = getUniqueIdFromComponent(currentComponent);
                // eslint-disable-next-line no-param-reassign
                draftState.entities.openapi.data.components = components
                    .map((component) => (getUniqueIdFromComponent(component) === currentComponentId
                        ? newComponent
                        : component
                    ));
            },
            notificationsToTrigger: [StateChangeNotification.COMPONENT_EDIT],
        });
    },
});

export const fetchImplementations = (payload: {
    implementations: IDatasetImplementation[];
}) => createAction<{
    implementations: IDatasetImplementation[];
}>({
    type: 'DATA_DATASETS.IMPLEMENTATIONS',
    payload,
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                const { implementations } = payload;
                const datasetDetail = draftState.entities.datasetDetail.data;
                // eslint-disable-next-line no-param-reassign
                draftState.entities.datasetDetail.data = {
                    ...datasetDetail,
                    implementations: implementations.map((implementation) => ({
                        type: implementation.type,
                        labels: implementation.labels,
                        keyValues: implementation.keyValues,
                    })),
                };
            },
            notificationsToTrigger: [StateChangeNotification.DATA_DATASETS_DETAIL],
        });
    },
});
