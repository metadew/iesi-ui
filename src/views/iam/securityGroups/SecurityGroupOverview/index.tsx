import React from 'react';
import { IObserveProps, observe } from 'views/observe';
import { Box, Button, createStyles, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import { ISecurityGroup, ISecurityGroupColumnNames } from 'models/state/securityGroups.model';
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
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getSecurityGroupsListFilter } from 'state/ui/selectors';
import { getIntialFiltersFromFilterConfig } from 'utils/list/filters';
import {
    getAsyncSecurityGroupDetail,
    getAsyncSecurityGroups,
    getAsyncSecurityGroupsEntity,
    getAsyncSecurityGroupsPageData,
} from 'state/entities/securityGroups/selectors';
import { triggerDeleteSecurityGroupDetail, triggerFetchSecurityGroups } from 'state/entities/securityGroups/triggers';
import { formatSortQueryParameter } from 'utils/core/string/format';
import { setSecurityGroupsListFilter } from 'state/ui/actions';
import { getUniqueIdFromSecurityGroup } from 'utils/securityGroups/securityGroupUtils';
import OrderedList from 'views/common/list/OrderedList';
import AppTemplateContainer from 'views/appShell/AppTemplateContainer';
import GenericSort from 'views/common/list/GenericSort';
import { checkAuthority } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import { AddRounded, Delete, Edit, Visibility } from '@material-ui/icons';
import ContentWithSlideoutPanel from 'views/common/layout/ContentWithSlideoutPanel';
import GenericFilter from 'views/common/list/GenericFilter';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { getTranslator } from 'state/i18n/selectors';
import GenericList from 'views/common/list/GenericList';
import { Alert } from '@material-ui/lab';
import { redirectTo, ROUTE_KEYS } from 'views/routes';
import { StateChangeNotification } from 'models/state.models';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';

const styles = ({ palette, typography }: Theme) => createStyles({
    header: {
        backgroundColor: palette.background.paper,
        borderBottom: '1px solid',
        borderBottomColor: palette.grey[200],
    },
    name: {
        fontWeight: typography.fontWeightBold,
        color: palette.primary.main,
    },
    teams: {
        fontWeight: typography.fontWeightBold,
    },
});

type TProps = WithStyles<typeof styles>;

interface IComponentState {
    securityGroupIdToDelete: string;
}

const defaultSortedColumn: ISortedColumn<ISecurityGroupColumnNames> = {
    name: 'name',
    sortOrder: SortOrder.Descending,
    sortType: SortType.String,
};

const filterConfig: FilterConfig<Partial<ISecurityGroupColumnNames>> = {
    name: {
        label: <Translate msg="security_groups.overview.list.filter.name" />,
        filterType: FilterType.Search,
    },
};

const sortActions: SortActions<Partial<ISecurityGroupColumnNames>> = {
    name: {
        label: <Translate msg="security_groups.overview.list.sort.name" />,
        sortType: SortType.String,
    },
};

const SecurityGroupsOverview = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, IComponentState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);

            this.state = {
                securityGroupIdToDelete: null,
            };

            this.combineFiltersFromUrlAndCurrentFilters = this.combineFiltersFromUrlAndCurrentFilters.bind(this);
            // eslint-disable-next-line max-len
            this.fetchSecurityGroupsWithFilterAndPagination = this.fetchSecurityGroupsWithFilterAndPagination.bind(this);
            // eslint-disable-next-line max-len
            this.closeDeleteSecurityGroupDialogAfterSuccessfulDelete = this.closeDeleteSecurityGroupDialogAfterSuccessfulDelete.bind(this);

            this.onSort = this.onSort.bind(this);
            this.onFilter = this.onFilter.bind(this);
            this.onDeleteSecurityGroup = this.onDeleteSecurityGroup.bind(this);

            this.renderPanel = this.renderPanel.bind(this);
            this.renderContent = this.renderContent.bind(this);
        }

        public componentDidMount() {
            const { dispatch } = this.props;
            const initialFilters = this.combineFiltersFromUrlAndCurrentFilters();

            this.fetchSecurityGroupsWithFilterAndPagination({ newListFilters: initialFilters, newPage: 1 });
            dispatch(setSecurityGroupsListFilter({ filters: initialFilters }));
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            const { state, dispatch } = prevProps;
            const filterFromState = getSecurityGroupsListFilter(state);

            if (filterFromState.filters === null || filterFromState.sortedColumn === null) {
                dispatch(setSecurityGroupsListFilter({
                    filters: filterFromState.filters === null && getIntialFiltersFromFilterConfig(filterConfig),
                    sortedColumn: filterFromState.sortedColumn === null && {
                        name: 'name',
                        sortOrder: SortOrder.Descending,
                        sortType: SortType.String,
                    },
                }));
            }
            this.closeDeleteSecurityGroupDialogAfterSuccessfulDelete(prevProps);
        }

        public render() {
            const { classes, state } = this.props;
            const { securityGroupIdToDelete } = this.state;
            const pageData = getAsyncSecurityGroupsPageData(state);
            const filterFromState = getSecurityGroupsListFilter(state);
            const securityGroups = getAsyncSecurityGroups(state);
            const listItems = mapSecurityGroupsToListItems(securityGroups);
            const deleteStatus = getAsyncSecurityGroupDetail(state).remove.status;
            const translator = getTranslator(state);

            return (
                <>
                    <Box height="100%" display="flex" flexDirection="column" flex="1 0 auto">
                        <Box
                            paddingTop={3}
                            paddingBottom={3}
                            className={classes.header}
                        >
                            <AppTemplateContainer>
                                <Typography variant="h6">
                                    <Translate
                                        msg="security_groups.overview.header.amount"
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
                                        checkAuthority(state, SECURITY_PRIVILEGES.S_GROUPS_WRITE) && (
                                            <Box display="flex" alignItems="center">
                                                <Box flex="0 0 auto">
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        startIcon={<AddRounded />}
                                                        onClick={() => {
                                                            redirectTo({
                                                                routeKey: ROUTE_KEYS.R_SECURITY_GROUP_NEW,
                                                            });
                                                        }}
                                                    >
                                                        <Translate msg="security_groups.overview.header.add_button" />
                                                    </Button>
                                                </Box>
                                            </Box>
                                        )
                                    }
                                </Box>
                            </AppTemplateContainer>
                            <ContentWithSlideoutPanel
                                toggleLabel={<Translate msg="common.list.filter.toggle" />}
                                panel={this.renderPanel({ listItems })}
                                content={this.renderContent({ listItems })}
                                initialIsOpenState={
                                    (filterFromState.filters
                                        && (filterFromState.filters.name.values.length > 0))
                                }
                            />
                            <ConfirmationDialog
                                title={translator('security_groups.overview.delete_security_group_dialog.title')}
                                text={translator('security_groups.overview.delete_security_group_dialog.text')}
                                open={!!securityGroupIdToDelete}
                                onClose={() => this.setState({ securityGroupIdToDelete: null })}
                                onConfirm={this.onDeleteSecurityGroup}
                                showLoader={deleteStatus === AsyncStatus.Busy}
                            />
                        </Box>
                    </Box>
                </>
            );
        }

        private renderPanel({ listItems }: { listItems: IListItem<ISecurityGroupColumnNames>[] }) {
            const { state } = this.props;
            const filterFromState = getSecurityGroupsListFilter(state);

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

        private renderContent({ listItems }: { listItems: IListItem<ISecurityGroupColumnNames>[] }) {
            const { state, dispatch, classes } = this.props;
            const asyncSecurityGroupsEntity = getAsyncSecurityGroupsEntity(state);
            const securityGroupsFetchData = asyncSecurityGroupsEntity.fetch;
            const isFetching = securityGroupsFetchData.status === AsyncStatus.Busy;
            const hasError = securityGroupsFetchData.status === AsyncStatus.Error;
            const securityGroupsData = asyncSecurityGroupsEntity.data;
            const pageData = securityGroupsData ? securityGroupsData.page : null;
            const translator = getTranslator(state);

            const columns: ListColumns<ISecurityGroupColumnNames> = {
                name: {
                    label: <Translate msg="security_groups.overview.list.labels.name" />,
                    className: classes.name,
                    fixedWidth: '95%',
                },
                teams: {
                    label: <Translate msg="security_groups.overview.list.labels.teams" />,
                    className: classes.teams,
                    fixedWidth: '5%',
                },
            };

            return (
                <>
                    <Box paddingBottom={5} marginX={2.8}>
                        {
                            !hasError ? (
                                <GenericList
                                    columns={columns}
                                    listItems={listItems}
                                    isLoading={isFetching}
                                    pagination={{
                                        pageData,
                                        onChange: ({ page }) => {
                                            this.fetchSecurityGroupsWithFilterAndPagination({ newPage: page });
                                            dispatch(setSecurityGroupsListFilter({ page }));
                                        },
                                    }}
                                    listActions={[].concat({
                                        icon: <Edit />,
                                        label: translator('security_groups.overview.list.actions.edit'),
                                        onClick: (id: string) => {
                                            const securityGroups = getAsyncSecurityGroups(state);
                                            const selectedSecurityGroup = securityGroups
                                                .find((securityGroup: ISecurityGroup) => (
                                                    getUniqueIdFromSecurityGroup(securityGroup) === id
                                                ));

                                            redirectTo({
                                                routeKey: ROUTE_KEYS.R_SECURITY_GROUP_DETAIL,
                                                params: {
                                                    name: selectedSecurityGroup.name,
                                                },
                                            });
                                        },
                                        hideAction: () =>
                                            !checkAuthority(state, SECURITY_PRIVILEGES.S_GROUPS_WRITE),
                                    }, {
                                        icon: <Visibility />,
                                        label: translator('security_groups.overview.list.actions.view'),
                                        onClick: (id: string) => {
                                            const securityGroups = getAsyncSecurityGroups(state);
                                            const selectedSecurityGroup = securityGroups
                                                .find((securityGroup: ISecurityGroup) => (
                                                    getUniqueIdFromSecurityGroup(securityGroup) === id
                                                ));
                                            redirectTo({
                                                routeKey: ROUTE_KEYS.R_SECURITY_GROUP_DETAIL,
                                                params: {
                                                    name: selectedSecurityGroup.name,
                                                },
                                            });
                                        },
                                        hideAction: () =>
                                            checkAuthority(state, SECURITY_PRIVILEGES.S_GROUPS_WRITE),
                                    }, {
                                        icon: <Delete />,
                                        label: translator('security_groups.overview.list.actions.delete'),
                                        onClick: (id: string) => {
                                            const securityGroups = getAsyncSecurityGroups(state);
                                            const selectedSecurityGroup = securityGroups
                                                .find((securityGroup: ISecurityGroup) => (
                                                    getUniqueIdFromSecurityGroup(securityGroup) === id
                                                ));
                                            this.setState({ securityGroupIdToDelete: selectedSecurityGroup.id });
                                        },
                                        hideAction: () =>
                                            !checkAuthority(state, SECURITY_PRIVILEGES.S_GROUPS_WRITE),
                                    })}
                                />
                            ) : (
                                <Box padding={2}>
                                    <Alert severity="error">
                                        <Translate msg="security_groups.overview.list.fetch_error" />
                                    </Alert>
                                </Box>
                            )
                        }
                    </Box>
                </>
            );
        }

        private onDeleteSecurityGroup() {
            const { securityGroupIdToDelete } = this.state;

            if (securityGroupIdToDelete) {
                triggerDeleteSecurityGroupDetail({ id: securityGroupIdToDelete });
            }
        }

        private onFilter(listFilters: ListFilters<Partial<ISecurityGroupColumnNames>>) {
            const { dispatch } = this.props;
            this.fetchSecurityGroupsWithFilterAndPagination({ newListFilters: listFilters });
            dispatch(setSecurityGroupsListFilter({ filters: listFilters }));
        }

        private onSort(sortedColumn: ISortedColumn<ISecurityGroupColumnNames>) {
            const { dispatch } = this.props;
            this.fetchSecurityGroupsWithFilterAndPagination({ newSortedColumn: sortedColumn });
            dispatch(setSecurityGroupsListFilter({ sortedColumn }));
        }

        private closeDeleteSecurityGroupDialogAfterSuccessfulDelete(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncSecurityGroupDetail(this.props.state).remove;
            const prevStatus = getAsyncSecurityGroupDetail(prevProps.state).remove.status;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                this.setState({ securityGroupIdToDelete: null });
                this.fetchSecurityGroupsWithFilterAndPagination({});
            }
        }

        private fetchSecurityGroupsWithFilterAndPagination({
            newPage,
            newListFilters,
            newSortedColumn,
        }: {
            newPage?: number;
            newListFilters?: ListFilters<Partial<ISecurityGroupColumnNames>>;
            newSortedColumn?: ISortedColumn<ISecurityGroupColumnNames>;
        }) {
            const { state } = this.props;
            const pageData = getAsyncSecurityGroupsPageData(state);
            const filterFromState = getSecurityGroupsListFilter(state);

            const filters = newListFilters || filterFromState.filters;
            const page = newListFilters ? 1 : newPage || pageData.number;
            const sortedColumn = newSortedColumn || filterFromState.sortedColumn || defaultSortedColumn;

            triggerFetchSecurityGroups({
                pagination: { page },
                filter: {
                    name: filters.name.values.length > 0
                        && filters.name.values[0].toString(),
                },
                sort: formatSortQueryParameter(sortedColumn),
            });
        }

        private combineFiltersFromUrlAndCurrentFilters() {
            const { state } = this.props;
            const filterFromState = getSecurityGroupsListFilter(state);
            const searchParams = new URLSearchParams(window.location.search);
            const defaultFilters = filterFromState.filters || getIntialFiltersFromFilterConfig(filterConfig);
            const hasValidParams = Array.from(searchParams.keys()).some((r) => Object.keys(filterConfig).includes(r));

            if (hasValidParams) {
                // reset filters in redux state & only set url params
                const filtersByUrlSearchParams = getIntialFiltersFromFilterConfig(filterConfig);
                Array.from(searchParams.keys()).forEach((searchParamKey: string) => {
                    if (Object.keys(filterConfig).includes(searchParamKey)) {
                        const filterValue = searchParams.get(searchParamKey);
                        if (!filtersByUrlSearchParams[searchParamKey as keyof ISecurityGroupColumnNames]
                            .values.includes(filterValue)) {
                            filtersByUrlSearchParams[searchParamKey as keyof ISecurityGroupColumnNames]
                                .values.push(filterValue);
                        }
                    }
                });
                return filtersByUrlSearchParams;
            }
            return defaultFilters;
        }
    },
);

function mapSecurityGroupsToListItems(securityGroups: ISecurityGroup[]): IListItem<ISecurityGroupColumnNames>[] {
    return securityGroups.map((securityGroup) => ({
        id: getUniqueIdFromSecurityGroup(securityGroup),
        columns: {
            name: securityGroup.name,
            teams: {
                value: securityGroup.teams.length,
                tooltip: securityGroup.teams.length > 0 && (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={securityGroup.teams.map((team) => ({
                                content: team.teamName,
                            }))}
                        />
                    </Typography>
                ),
            },
        },
    }));
}

export default observe<TProps>([
    StateChangeNotification.IAM_SECURITY_GROUPS_LIST,
    StateChangeNotification.IAM_SECURITY_GROUPS_DETAIL,
], SecurityGroupsOverview);
