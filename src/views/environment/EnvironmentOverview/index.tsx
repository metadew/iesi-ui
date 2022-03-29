import React, { ReactText } from 'react';
import { IObserveProps, observe } from 'views/observe';
import { Theme, Box, WithStyles, withStyles, Typography, Button } from '@material-ui/core';
import AppTemplateContainer from 'views/appShell/AppTemplateContainer';
import {
    getAsyncEnvironments,
    getAsyncEnvironmentsEntity,
    getAsyncEnvironmentsPageData,
    getAsyncEnvironmentDetail,
} from 'state/entities/environments/selectors';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import GenericSort from 'views/common/list/GenericSort';
import { IEnvironment, IEnvironmentColumnNamesBase } from 'models/state/environments.models';
import {
    FilterConfig,
    FilterType,
    IListItem,
    ISortedColumn,
    ListColumns,
    ListFilters,
    SortActions,
    SortOrder,
    SortType,
} from 'models/list.models';
import { getEnvironmentsListFilter } from 'state/ui/selectors';
import { getIntialFiltersFromFilterConfig } from 'utils/list/filters';
import { triggerDeleteConnectionDetail, triggerFetchConnections } from 'state/entities/connections/triggers';
import { formatSortQueryParameter } from 'utils/core/string/format';
import { setEnvironmentsListFilter } from 'state/ui/actions';
import TransformDocumentationDialog from 'views/design/common/TransformDocumentationDialog';
import { AddRounded, Delete, Edit, Visibility } from '@material-ui/icons';
import { redirectTo, ROUTE_KEYS } from 'views/routes';
import ContentWithSlideoutPanel from 'views/common/layout/ContentWithSlideoutPanel';
import { getUniqueIdFromEnvironment } from 'utils/environments/environmentUtils';
import GenericFilter from 'views/common/list/GenericFilter';
import { getTranslator } from 'state/i18n/selectors';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import GenericList from 'views/common/list/GenericList';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
import { StateChangeNotification } from 'models/state.models';
import OrderedList from 'views/common/list/OrderedList';
import { checkAuthority, checkAuthorityGeneral } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';

const styles = (({ palette, typography }: Theme) => ({
    header: {
        backgroundColor: palette.background.paper,
        borderBottom: '1px solid',
        borderBottomColor: palette.grey[200],
    },
    connectionName: {
        fontWeight: typography.fontWeightBold,
        color: palette.primary.main,
    },
    connectionType: {
        fontWeight: typography.fontWeightBold,
    },
    connectionEnvironment: {
        fontWeight: typography.fontWeightBold,
    },
    connectionDescription: {
        fontWeight: typography.fontWeightBold,
        fontSize: typography.pxToRem(12),
    },
    connectionSecurityGroupName: {
        fontWeight: typography.fontWeightBold,
        fontSize: typography.pxToRem(12),
    },
}));

const filterConfig: FilterConfig<Partial<IEnvironmentColumnNamesBase>> = {
    name: {
        label: <Translate msg="connections.overview.list.filter.connection_name" />,
        filterType: FilterType.Search,
    },
};

const sortActions: SortActions<Partial<IEnvironmentColumnNamesBase>> = {
    name: {
        label: <Translate msg="connections.overview.list.sort.connection_name" />,
        sortType: SortType.String,
    },
};

const defaultSortedColumn: ISortedColumn<IEnvironmentColumnNamesBase> = {
    name: 'name',
    sortOrder: SortOrder.Descending,
    sortType: SortType.String,
};

interface IComponentState {
    connectionIdToDelete: string;
    loadDocDialogOpen: boolean;
}
type TProps = WithStyles<typeof styles>;

const EnvironmentOverview = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, IComponentState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);

            this.state = {
                connectionIdToDelete: null,
                loadDocDialogOpen: false,
            };

            this.onSort = this.onSort.bind(this);
            this.fetchConnectionssWithFilterAndPagination = this.fetchConnectionssWithFilterAndPagination.bind(this);
            this.renderPanel = this.renderPanel.bind(this);
            this.renderContent = this.renderContent.bind(this);
            this.onFilter = this.onFilter.bind(this);

            this.setConnectionToDelete = this.setConnectionToDelete.bind(this);
            this.onDeleteConnection = this.onDeleteConnection.bind(this);
            // eslint-disable-next-line max-len
            this.closeDeleteConnectionDialogAfterSuccessfulDelete = this.closeDeleteConnectionDialogAfterSuccessfulDelete.bind(this);
            this.clearConnectionToDelete = this.clearConnectionToDelete.bind(this);

            this.onLoadDocDialogOpen = this.onLoadDocDialogOpen.bind(this);
            this.onLoadDocDialogClose = this.onLoadDocDialogClose.bind(this);
            this.combineFiltersFromUrlAndCurrentFilters = this.combineFiltersFromUrlAndCurrentFilters.bind(this);
        }

        public componentDidMount() {
            const { dispatch } = this.props;
            const initialFilters = this.combineFiltersFromUrlAndCurrentFilters();

            this.fetchConnectionssWithFilterAndPagination({ newListFilters: initialFilters, newPage: 1 });
            dispatch(setEnvironmentsListFilter({ filters: initialFilters }));
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            const { state, dispatch } = prevProps;
            const filterFromState = getEnvironmentsListFilter(state);
            if (filterFromState.filters === null || filterFromState.sortedColumn === null) {
                dispatch(setEnvironmentsListFilter({
                    filters: filterFromState.filters === null && getIntialFiltersFromFilterConfig(filterConfig),
                    sortedColumn: filterFromState.sortedColumn === null && {
                        name: 'name',
                        sortOrder: SortOrder.Ascending,
                        sortType: SortType.String,
                    },
                }));
            }
            this.closeDeleteConnectionDialogAfterSuccessfulDelete(prevProps);
        }

        public render() {
            const { classes, state } = this.props;
            const { loadDocDialogOpen, connectionIdToDelete } = this.state;
            const pageData = getAsyncEnvironmentsPageData(state);
            const filterFromState = getEnvironmentsListFilter(state);
            console.log(getEnvironmentsListFilter(state));
            const connections = getAsyncEnvironments(state);
            const listItems = mapConnectionsToListItems(connections);
            const translator = getTranslator(state);
            return (
                <Box height="100%" display="flex" flexDirection="column" flex="1 0 auto">
                    <Box
                        paddingTop={3}
                        paddingBottom={3}
                        className={classes.header}
                    >
                        <AppTemplateContainer>
                            <Typography variant="h6">
                                <Translate
                                    msg="environments.overview.header.amount"
                                    placeholders={{ amount: pageData ? pageData.totalElements : 0 }}
                                />
                            </Typography>
                            <Box display="flex" alignItems="flex-end">
                                <Box flex="1 0 auto">
                                    <GenericSort
                                        sortActions={sortActions}
                                        onSort={this.onSort}
                                        sortedColumn={filterFromState.sortedColumn as ISortedColumn<{}>}
                                    />
                                </Box>
                                {
                                    checkAuthorityGeneral(state, SECURITY_PRIVILEGES.S_CONNECTIONS_WRITE) && (
                                        <Box display="flex" alignItems="center">
                                            <Box flex="0 0 auto" mr="8px" width="250px">
                                                <TransformDocumentationDialog
                                                    open={loadDocDialogOpen}
                                                    onOpen={this.onLoadDocDialogOpen}
                                                    onClose={this.onLoadDocDialogClose}
                                                />
                                            </Box>
                                            <Box flex="0 0 auto">
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    size="small"
                                                    startIcon={<AddRounded />}
                                                    onClick={() => {
                                                        redirectTo({ routeKey: ROUTE_KEYS.R_CONNECTION_NEW });
                                                    }}
                                                >
                                                    <Translate msg="environments.overview.header.add_button" />
                                                </Button>
                                            </Box>
                                        </Box>
                                    )
                                }
                            </Box>
                        </AppTemplateContainer>
                    </Box>
                    <ContentWithSlideoutPanel
                        toggleLabel={
                            <Translate msg="common.list.filter.toggle" />
                        }
                        panel={this.renderPanel({ listItems })}
                        content={this.renderContent({ listItems })}
                        initialIsOpenState={
                            (filterFromState.filters
                                && (filterFromState.filters.name.values.length > 0))
                        }
                    />
                    <ConfirmationDialog
                        title={translator('environments.overview.delete_environment_dialog.title')}
                        text={translator('environments.overview.delete_environment_dialog.text')}
                        open={!!connectionIdToDelete}
                        onClose={this.clearConnectionToDelete}
                        onConfirm={this.onDeleteConnection}
                    />
                </Box>
            );
        }

        private renderPanel({ listItems }: { listItems: IListItem<IEnvironmentColumnNamesBase>[] }) {
            const { state } = this.props;
            const filterFromState = getEnvironmentsListFilter(state);

            return (
                <>
                    <GenericFilter
                        filterConfig={filterConfig}
                        onFilterChange={this.onFilter}
                        listItems={listItems}
                        initialFilters={filterFromState.filters}
                    />
                </>
            );
        }

        private renderContent({ listItems }: { listItems: IListItem<IEnvironmentColumnNamesBase>[] }) {
            const { classes, state, dispatch } = this.props;
            const translator = getTranslator(state);
            const columns: ListColumns<IEnvironmentColumnNamesBase> = {
                name: {
                    label: <Translate msg="environments.overview.list.labels.name" />,
                    className: classes.connectionName,
                    fixedWidth: '35%',
                },
                description: {
                    label: <Translate msg="environments.overview.list.labels.description" />,
                    className: classes.connectionDescription,
                    fixedWidth: '40%',
                    noWrap: true,
                },
                parameters: {
                    label: <Translate msg="environments.overview.list.labels.parameters" />,
                    className: classes.connectionEnvironment,
                    noWrap: true,
                    fixedWidth: '5%',
                },
            };

            const asyncConnectionsEntity = getAsyncEnvironmentsEntity(state);
            const connectionsFetchData = asyncConnectionsEntity.fetch;
            const isFetching = connectionsFetchData.status === AsyncStatus.Busy;
            const hasError = connectionsFetchData.status === AsyncStatus.Error;
            const connectionsData = asyncConnectionsEntity.data;
            const pageData = connectionsData ? connectionsData.page : null;

            return (
                <>
                    <Box paddingBottom={5} marginX={2.8}>
                        {
                            !hasError && (
                                <GenericList
                                    listActions={[].concat(
                                        {
                                            icon: <Edit />,
                                            label: translator('connections.overview.list.actions.edit'),
                                            onClick: (id: string) => {
                                                const connections = getAsyncEnvironments(state);
                                                const selectedConnection = connections.find((item) =>
                                                    getUniqueIdFromEnvironment(item) === id);
                                                redirectTo({
                                                    routeKey: ROUTE_KEYS.R_CONNECTION_DETAIL,
                                                    params: {
                                                        name: selectedConnection.name,
                                                    },
                                                });
                                            },
                                        }, {
                                            icon: <Visibility />,
                                            label: translator('connections.overview.list.actions.view'),
                                            onClick: (id: string) => {
                                                const connections = getAsyncEnvironments(state);
                                                const selectedConnection = connections.find((item) =>
                                                    getUniqueIdFromEnvironment(item) === id);
                                                redirectTo({
                                                    routeKey: ROUTE_KEYS.R_CONNECTION_DETAIL,
                                                    params: {
                                                        name: selectedConnection.name,
                                                    },
                                                });
                                            },
                                            hideAction: (item: IListItem<IEnvironmentColumnNamesBase>) => (
                                                !checkAuthority(
                                                    state,
                                                    SECURITY_PRIVILEGES.S_CONNECTIONS_WRITE,
                                                    item.data.securityGroupName,
                                                )
                                            ),
                                        }, {
                                            icon: <Delete />,
                                            label: translator('connections.overview.list.actions.delete'),
                                            onClick: this.setConnectionToDelete,
                                            hideAction: () => (
                                                !checkAuthorityGeneral(state, SECURITY_PRIVILEGES.S_CONNECTIONS_WRITE)
                                            ),
                                        },
                                    )}
                                    columns={columns}
                                    listItems={listItems}
                                    pagination={{
                                        pageData,
                                        onChange: ({ page }) => {
                                            this.fetchConnectionssWithFilterAndPagination({ newPage: page });
                                            dispatch(setEnvironmentsListFilter({ page }));
                                        },
                                    }}
                                    isLoading={isFetching}
                                />
                            )
                        }

                    </Box>
                </>
            );
        }

        private onSort(sortedColumn: ISortedColumn<IEnvironmentColumnNamesBase>) {
            const { dispatch } = this.props;
            this.fetchConnectionssWithFilterAndPagination({ newSortedColumn: sortedColumn });
            dispatch(setEnvironmentsListFilter({ sortedColumn }));
        }

        private combineFiltersFromUrlAndCurrentFilters() {
            const { state } = this.props;
            const filterFromState = getEnvironmentsListFilter(state);
            const searchParams = new URLSearchParams(window.location.search);
            const defaultFilters = filterFromState.filters || getIntialFiltersFromFilterConfig(filterConfig);
            const hasValidUrlParams = Array.from(searchParams.keys()).some((r) =>
                Object.keys(filterConfig).includes(r));

            if (hasValidUrlParams) {
                // reset filters in redux state & only set url params
                const filtersByUrlSearchParams = getIntialFiltersFromFilterConfig(filterConfig);
                Array.from(searchParams.keys()).forEach(
                    (searchParamKey: string) => {
                        if (Object.keys(filterConfig).includes(searchParamKey)) {
                            const filterValue = searchParams.get(searchParamKey);
                            if (
                                !filtersByUrlSearchParams[searchParamKey as keyof IEnvironmentColumnNamesBase]
                                    .values.includes(filterValue)
                            ) {
                                filtersByUrlSearchParams[searchParamKey as keyof IEnvironmentColumnNamesBase].values
                                    .push(filterValue);
                            }
                        }
                    },
                );
                return filtersByUrlSearchParams;
            }

            return defaultFilters;
        }

        private fetchConnectionssWithFilterAndPagination({
            newPage,
            newListFilters,
            newSortedColumn,
        }: {
            newPage?: number;
            newListFilters?: ListFilters<Partial<IEnvironmentColumnNamesBase>>;
            newSortedColumn?: ISortedColumn<IEnvironmentColumnNamesBase>;
        }) {
            const { state } = this.props;
            const pageData = getAsyncEnvironmentsPageData(this.props.state);

            const filtersFromState = getEnvironmentsListFilter(state);

            const filters = newListFilters || filtersFromState.filters;
            const page = newListFilters ? 1 : newPage || pageData.number;
            const sortedColumn = newSortedColumn || filtersFromState.sortedColumn || defaultSortedColumn;
            triggerFetchConnections({
                pagination: { page },
                filter: {
                    name: filters.name.values.length > 0
                        && filters.name.values[0].toString(),
                },
                sort: formatSortQueryParameter(sortedColumn),
            });
        }

        private onFilter(listFilters: ListFilters<Partial<IEnvironmentColumnNamesBase>>) {
            const { dispatch } = this.props;
            this.fetchConnectionssWithFilterAndPagination({ newListFilters: listFilters });
            dispatch(setEnvironmentsListFilter({ filters: listFilters }));
        }

        private onDeleteConnection() {
            const { state } = this.props;
            const { connectionIdToDelete } = this.state;
            const connectionToDelete = getAsyncEnvironments(state).find((item) =>
                getUniqueIdFromEnvironment(item) === connectionIdToDelete);

            if (connectionToDelete) {
                triggerDeleteConnectionDetail({
                    name: connectionToDelete.name,
                });
            }
        }

        private closeDeleteConnectionDialogAfterSuccessfulDelete(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncEnvironmentDetail(this.props.state).remove;
            const prevStatus = getAsyncEnvironmentDetail(prevProps.state).remove.status;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                this.clearConnectionToDelete();
                this.fetchConnectionssWithFilterAndPagination({});
            }
        }

        private setConnectionToDelete(id: ReactText) {
            this.setState({ connectionIdToDelete: id as string });
        }

        private clearConnectionToDelete() {
            this.setState({ connectionIdToDelete: null });
        }

        private onLoadDocDialogOpen() {
            this.setState((state) => ({ ...state, loadDocDialogOpen: true }));
        }

        private onLoadDocDialogClose() {
            this.setState((state) => ({ ...state, loadDocDialogOpen: false }));
        }
    },
);

function mapConnectionsToListItems(environments: IEnvironment[]): IListItem<IEnvironmentColumnNamesBase>[] {
    return environments.map((environment) => ({
        id: getUniqueIdFromEnvironment(environment),
        columns: {
            name: environment.name,
            description: environment.description,
            parameters: {
                value: environment.parameters.length,
                tooltip: environment.parameters.length > 0 && (
                    <Typography>
                        <OrderedList
                            items={environment.parameters
                                .map((parameter) => ({
                                    content: parameter.name,
                                }))}
                        />
                    </Typography>
                ),
            },
        },
        data: {
            parameters: environment.parameters,
        },
    }));
}

export default observe<TProps>([
    StateChangeNotification.CONNECTIVITY_CONNECTIONS_LIST,
    StateChangeNotification.CONNECTIVITY_CONNECTION_DETAIL,
], EnvironmentOverview);
