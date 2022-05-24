import React, { ReactText } from 'react';
import { IObserveProps, observe } from 'views/observe';
import { Theme, Box, WithStyles, withStyles, Typography, Button } from '@material-ui/core';
import AppTemplateContainer from 'views/appShell/AppTemplateContainer';
import {
    getAsyncEnvironmentDetail,
    getAsyncEnvironments,
    getAsyncEnvironmentsEntity,
    getAsyncEnvironmentsPageData,
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
import { formatSortQueryParameter } from 'utils/core/string/format';
import { setEnvironmentsListFilter } from 'state/ui/actions';
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
// import OrderedList from 'views/common/list/OrderedList';
import { checkAuthority } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import { triggerDeleteEnvironmentDetail, triggerFetchEnvironments } from 'state/entities/environments/triggers';
import OrderedList from 'views/common/list/OrderedList';

const styles = (({ palette, typography }: Theme) => ({
    header: {
        backgroundColor: palette.background.paper,
        borderBottom: '1px solid',
        borderBottomColor: palette.grey[200],
    },
    environmentName: {
        fontWeight: typography.fontWeightBold,
        color: palette.primary.main,
    },
    environmentParameter: {
        fontWeight: typography.fontWeightBold,
    },
    environmentDescription: {
        fontWeight: typography.fontWeightBold,
        fontSize: typography.pxToRem(12),
    },
}));

const filterConfig: FilterConfig<Partial<IEnvironmentColumnNamesBase>> = {
    name: {
        label: <Translate msg="environments.overview.list.filter.environment_name" />,
        filterType: FilterType.Search,
    },
};

const sortActions: SortActions<Partial<IEnvironmentColumnNamesBase>> = {
    name: {
        label: <Translate msg="environments.overview.list.sort.environment_name" />,
        sortType: SortType.String,
    },
};

const defaultSortedColumn: ISortedColumn<IEnvironmentColumnNamesBase> = {
    name: 'name',
    sortOrder: SortOrder.Descending,
    sortType: SortType.String,
};

interface IComponentState {
    environmentIdToDelete: string;
    loadDocDialogOpen: boolean;
}
type TProps = WithStyles<typeof styles>;

const EnvironmentOverview = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, IComponentState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);
            this.state = {
                environmentIdToDelete: null,
                loadDocDialogOpen: false,
            };

            this.onSort = this.onSort.bind(this);
            this.fetchEnvironmentsWithFilterAndPagination = this.fetchEnvironmentsWithFilterAndPagination.bind(this);
            this.renderPanel = this.renderPanel.bind(this);
            this.renderContent = this.renderContent.bind(this);
            this.onFilter = this.onFilter.bind(this);

            this.setEnvironmentToDelete = this.setEnvironmentToDelete.bind(this);
            this.onDeleteEnvironment = this.onDeleteEnvironment.bind(this);
            // eslint-disable-next-line max-len
            this.closeDeleteDialogAfterSuccessfulDelete = this.closeDeleteDialogAfterSuccessfulDelete.bind(this);
            this.clearConnectionToDelete = this.clearConnectionToDelete.bind(this);
            this.onLoadDocDialogOpen = this.onLoadDocDialogOpen.bind(this);
            this.onLoadDocDialogClose = this.onLoadDocDialogClose.bind(this);
            this.combineFiltersFromUrlAndCurrentFilters = this.combineFiltersFromUrlAndCurrentFilters.bind(this);
        }

        public componentDidMount() {
            const { dispatch } = this.props;
            const initialFilters = this.combineFiltersFromUrlAndCurrentFilters();

            this.fetchEnvironmentsWithFilterAndPagination({ newListFilters: initialFilters, newPage: 1 });
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
            this.closeDeleteDialogAfterSuccessfulDelete(prevProps);
        }

        public render() {
            const { classes, state } = this.props;
            const { environmentIdToDelete } = this.state;
            const pageData = getAsyncEnvironmentsPageData(state);
            const filterFromState = getEnvironmentsListFilter(state);
            const environments = getAsyncEnvironmentsEntity(state);
            const listItems = mapConnectionsToListItems(environments);
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
                                    checkAuthority(state, SECURITY_PRIVILEGES.S_ENVIRONMENTS_WRITE) && (
                                        <Box display="flex" alignItems="center">
                                            <Box flex="0 0 auto">
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    size="small"
                                                    startIcon={<AddRounded />}
                                                    onClick={() => {
                                                        redirectTo({ routeKey: ROUTE_KEYS.R_ENVIRONMENT_NEW });
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
                        open={!!environmentIdToDelete}
                        onClose={this.clearConnectionToDelete}
                        onConfirm={this.onDeleteEnvironment}
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
            const asyncEnvironmentsEntity = getAsyncEnvironments(state);
            const environmentsFetchData = asyncEnvironmentsEntity.fetch;
            const isFetching = environmentsFetchData.status === AsyncStatus.Busy;
            const hasError = environmentsFetchData.status === AsyncStatus.Error;
            const environmentsData = asyncEnvironmentsEntity.data;
            const pageData = environmentsData ? environmentsData.page : null;
            const columns: ListColumns<IEnvironmentColumnNamesBase> = {
                name: {
                    label: <Translate msg="environments.overview.list.labels.name" />,
                    className: classes.environmentName,
                    fixedWidth: '35%',
                },
                description: {
                    label: <Translate msg="environments.overview.list.labels.description" />,
                    className: classes.environmentDescription,
                    fixedWidth: '40%',
                    noWrap: true,
                },
                parameters: {
                    label: <Translate msg="environments.overview.list.labels.parameters" />,
                    className: classes.environmentParameter,
                    noWrap: true,
                    fixedWidth: '5%',
                },
            };

            return (
                <>
                    <Box paddingBottom={5} marginX={2.8}>
                        {
                            !hasError && (
                                <GenericList
                                    columns={columns}
                                    listItems={listItems}
                                    isLoading={isFetching}
                                    pagination={{
                                        pageData,
                                        onChange: ({ page }) => {
                                            this.fetchEnvironmentsWithFilterAndPagination({ newPage: page });
                                            dispatch(setEnvironmentsListFilter({ page }));
                                        },
                                    }}
                                    listActions={[].concat(
                                        {
                                            icon: <Edit />,
                                            label: translator('environments.overview.list.actions.edit'),
                                            onClick: (id: string) => {
                                                const environments = getAsyncEnvironmentsEntity(state);
                                                const selectedEnvironment = environments.find((item) =>
                                                    getUniqueIdFromEnvironment(item) === id);
                                                redirectTo({
                                                    routeKey: ROUTE_KEYS.R_ENVIRONMENT_DETAIL,
                                                    params: {
                                                        name: selectedEnvironment.name,
                                                    },
                                                });
                                            },
                                            hideAction: () => (
                                                !checkAuthority(state, SECURITY_PRIVILEGES.S_ENVIRONMENTS_WRITE)
                                            ),
                                        }, {
                                            icon: <Visibility />,
                                            label: translator('security_groups.overview.list.actions.view'),
                                            onClick: (id: string) => {
                                                const environments = getAsyncEnvironmentsEntity(state);
                                                const selectedEnvironment = environments.find((item) =>
                                                    getUniqueIdFromEnvironment(item) === id);
                                                redirectTo({
                                                    routeKey: ROUTE_KEYS.R_ENVIRONMENT_DETAIL,
                                                    params: {
                                                        name: selectedEnvironment.name,
                                                    },
                                                });
                                            },
                                            hideAction: () =>
                                                checkAuthority(state, SECURITY_PRIVILEGES.S_ENVIRONMENTS_WRITE),
                                        }, {
                                            icon: <Delete />,
                                            label: translator('environments.overview.list.actions.delete'),
                                            onClick: this.setEnvironmentToDelete,
                                            hideAction: () => (
                                                !checkAuthority(state, SECURITY_PRIVILEGES.S_ENVIRONMENTS_WRITE)
                                            ),
                                        },
                                    )}
                                />
                            )
                        }

                    </Box>
                </>
            );
        }

        private closeDeleteDialogAfterSuccessfulDelete(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncEnvironmentDetail(this.props.state).remove;
            const prevStatus = getAsyncEnvironmentDetail(prevProps.state).remove.status;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                this.setState({ environmentIdToDelete: null });
                this.fetchEnvironmentsWithFilterAndPagination({});
            }
        }

        private onDeleteEnvironment() {
            const { state } = this.props;
            const { environmentIdToDelete } = this.state;
            const environmentToDelete = getAsyncEnvironmentsEntity(state).find((item) =>
                getUniqueIdFromEnvironment(item) === environmentIdToDelete);

            if (environmentToDelete) {
                triggerDeleteEnvironmentDetail({
                    name: environmentToDelete.name,
                });
            }
        }

        private onSort(sortedColumn: ISortedColumn<IEnvironmentColumnNamesBase>) {
            const { dispatch } = this.props;
            this.fetchEnvironmentsWithFilterAndPagination({ newSortedColumn: sortedColumn });
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

        private fetchEnvironmentsWithFilterAndPagination({
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
            triggerFetchEnvironments({
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
            this.fetchEnvironmentsWithFilterAndPagination({ newListFilters: listFilters });
            dispatch(setEnvironmentsListFilter({ filters: listFilters }));
        }

        private setEnvironmentToDelete(id: ReactText) {
            this.setState({ environmentIdToDelete: id as string });
        }

        private clearConnectionToDelete() {
            this.setState({ environmentIdToDelete: null });
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
    StateChangeNotification.ENVIRONMENTS,
    StateChangeNotification.ENVIRONMENT_DETAIL,
    StateChangeNotification.LIST_FILTER_ENVIRONMENTS,

], EnvironmentOverview);
