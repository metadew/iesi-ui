import React from 'react';
import { IObserveProps, observe } from 'views/observe';
import {
    createStyles,
    withStyles,
    WithStyles,
    Theme,
    Box,
    Typography,
    Button,
} from '@material-ui/core';
import {
    FilterConfig,
    FilterType,
    ISortedColumn,
    ListFilters,
    SortOrder,
    SortType,
    SortActions,
    IListItem,
    ListColumns,
} from 'models/list.models';
import { IUser, IUserColumnName } from 'models/state/user.model';
import { getAsyncUsers, getAsyncUsersEntity, getAsyncUsersPageData } from 'state/entities/users/selectors';
import { getUsersListFilter } from 'state/ui/selectors';
import { triggerFetchUsers } from 'state/entities/users/triggers';
import { formatSortQueryParameter } from 'utils/core/string/format';
import { getIntialFiltersFromFilterConfig } from 'utils/list/filters';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { setUsersListFilter } from 'state/ui/actions';
import { StateChangeNotification } from 'models/state.models';
import AppTemplateContainer from 'views/appShell/AppTemplateContainer';
import GenericSort from 'views/common/list/GenericSort';
import { checkAuthorityGeneral } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import { AddRounded, Visibility } from '@material-ui/icons';
import { redirectTo, ROUTE_KEYS } from 'views/routes';
import ContentWithSlideoutPanel from 'views/common/layout/ContentWithSlideoutPanel';
import GenericFilter from 'views/common/list/GenericFilter';
import { getUniqueIdFromUser } from 'utils/users/userUtils';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import GenericList from 'views/common/list/GenericList';
import { getTranslator } from 'state/i18n/selectors';
import { Alert } from '@material-ui/lab';
import OrderedList from 'views/common/list/OrderedList';

const styles = ({ palette, typography }: Theme) => createStyles({
    header: {
        backgroundColor: palette.background.paper,
        borderBottom: '1px solid',
        borderBottomColor: palette.grey[200],
    },
    username: {
        fontWeight: typography.fontWeightBold,
        color: palette.primary.main,
    },
    enabled: {
        fontWeight: typography.fontWeightBold,
    },
    expired: {
        fontWeight: typography.fontWeightBold,
    },
    locked: {
        fontWeight: typography.fontWeightBold,
    },
    teams: {
        fontWeight: typography.fontWeightBold,
    },
});

type TProps = WithStyles<typeof styles>;

interface IComponentState {
    userIdToDelete: string;
}

const defaultSortedColumn: ISortedColumn<IUserColumnName> = {
    name: 'username',
    sortOrder: SortOrder.Descending,
    sortType: SortType.String,
};

const filterConfig: FilterConfig<Partial<IUserColumnName>> = {
    username: {
        label: <Translate msg="components.overview.list.filter.component_name" />,
        filterType: FilterType.Search,
    },
};

const sortActions: SortActions<Partial<IUserColumnName>> = {
    username: {
        label: <Translate msg="users.overview.list.sort.username" />,
        sortType: SortType.String,
    },
};

const UsersOverview = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, IComponentState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);

            this.state = {
                userIdToDelete: null,
            };

            this.renderPanel = this.renderPanel.bind(this);
            this.renderContent = this.renderContent.bind(this);

            this.fetchUsersWithFilterAndPagination = this.fetchUsersWithFilterAndPagination.bind(this);
            this.onFilter = this.onFilter.bind(this);
            this.onSort = this.onSort.bind(this);
        }

        public componentDidMount() {
            const { dispatch } = this.props;
            const initialFilters = this.combineFiltersFromUrlAndCurrentFilters();

            this.fetchUsersWithFilterAndPagination({ newListFilters: initialFilters, newPage: 1 });
            dispatch(setUsersListFilter({ filters: initialFilters }));
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            const { state, dispatch } = prevProps;
            const filterFromState = getUsersListFilter(state);

            if (filterFromState.filters === null || filterFromState.sortedColumn === null) {
                dispatch(setUsersListFilter({
                    filters: filterFromState.filters === null && getIntialFiltersFromFilterConfig(filterConfig),
                    sortedColumn: filterFromState.sortedColumn === null && {
                        name: 'username',
                        sortOrder: SortOrder.Descending,
                        sortType: SortType.String,
                    },
                }));
            }
        }

        public render() {
            const { classes, state } = this.props;
            const pageData = getAsyncUsersPageData(state);
            const filterFromState = getUsersListFilter(state);
            const users = getAsyncUsers(state);
            const listItems = mapUsersToListItems(users);
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
                                        msg="users.overview.header.amount"
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
                                        checkAuthorityGeneral(state, SECURITY_PRIVILEGES.S_USERS_WRITE) && (
                                            <Box display="flex" alignItems="center">
                                                <Box flex="0 0 auto">
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        startIcon={<AddRounded />}
                                                        onClick={() => {
                                                            redirectTo({ routeKey: ROUTE_KEYS.R_USER_NEW });
                                                        }}
                                                    >
                                                        <Translate msg="users.overview.header.add_button" />
                                                    </Button>
                                                </Box>
                                            </Box>
                                        )
                                    }
                                </Box>
                            </AppTemplateContainer>
                            <ContentWithSlideoutPanel
                                toggleLabel={
                                    <Translate msg="common.list.filter.toggle" />
                                }
                                panel={this.renderPanel({ listItems })}
                                content={this.renderContent({ listItems })}
                                initialIsOpenState={
                                    (filterFromState.filters
                                        && (filterFromState.filters.username.values.length > 0))
                                }

                            />
                        </Box>
                    </Box>
                </>
            );
        }

        private renderPanel({ listItems }: { listItems: IListItem<IUserColumnName>[] }) {
            const { state } = this.props;
            const filterFromState = getUsersListFilter(state);

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

        private renderContent({ listItems }: { listItems: IListItem<IUserColumnName>[] }) {
            const { state, classes, dispatch } = this.props;
            const asyncUsersEntity = getAsyncUsersEntity(state);
            const usersFetchData = asyncUsersEntity.fetch;
            const isFetching = usersFetchData.status === AsyncStatus.Busy;
            const hasError = usersFetchData.status === AsyncStatus.Error;
            const usersData = asyncUsersEntity.data;
            const pageData = usersData ? usersData.page : null;
            const translator = getTranslator(state);

            const columns: ListColumns<IUserColumnName> = {
                username: {
                    label: <Translate msg="users.overview.list.labels.username" />,
                    className: classes.username,
                    fixedWidth: '80%',
                },
                enabled: {
                    label: <Translate msg="users.overview.list.labels.enabled" />,
                    className: classes.enabled,
                    fixedWidth: '5%',
                },
                expired: {
                    label: <Translate msg="users.overview.list.labels.expired" />,
                    className: classes.expired,
                    fixedWidth: '5%',
                },
                locked: {
                    label: <Translate msg="users.overview.list.labels.locked" />,
                    className: classes.locked,
                    fixedWidth: '5%',
                },
                teams: {
                    label: <Translate msg="users.overview.list.labels.teams" />,
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
                                            this.fetchUsersWithFilterAndPagination({ newPage: page });
                                            dispatch(setUsersListFilter({ page }));
                                        },
                                    }}
                                    listActions={[].concat({
                                        icon: <Visibility />,
                                        label: translator('users.overview.list.actions.view'),
                                        onClick: (id: string) => {
                                            const users = getAsyncUsers(state);
                                            const selectedUser = users.find((item) =>
                                                getUniqueIdFromUser(item) === id);
                                            redirectTo({
                                                routeKey: ROUTE_KEYS.R_USER_DETAIL,
                                                params: {
                                                    name: selectedUser.username,
                                                },
                                            });
                                        },

                                    })}
                                />
                            ) : (
                                <Box padding={2}>
                                    <Alert severity="error">
                                        <Translate msg="users.overview.list.fetch_error" />
                                    </Alert>
                                </Box>
                            )
                        }
                    </Box>
                </>
            );
        }

        private onFilter(listFilters: ListFilters<Partial<IUserColumnName>>) {
            const { dispatch } = this.props;
            this.fetchUsersWithFilterAndPagination({ newListFilters: listFilters });
            dispatch(setUsersListFilter({ filters: listFilters }));
        }

        private onSort(sortedColumn: ISortedColumn<IUserColumnName>) {
            const { dispatch } = this.props;
            this.fetchUsersWithFilterAndPagination({ newSortedColumn: sortedColumn });
            dispatch(setUsersListFilter({ sortedColumn }));
        }

        private combineFiltersFromUrlAndCurrentFilters() {
            const { state } = this.props;
            const filterFromState = getUsersListFilter(state);
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
                                !filtersByUrlSearchParams[searchParamKey as keyof IUserColumnName]
                                    .values.includes(filterValue)
                            ) {
                                filtersByUrlSearchParams[searchParamKey as keyof IUserColumnName]
                                    .values.push(filterValue);
                            }
                        }
                    },
                );
                return filtersByUrlSearchParams;
            }

            return defaultFilters;
        }

        private fetchUsersWithFilterAndPagination({
            newPage,
            newListFilters,
            newSortedColumn,
        }: {
            newPage?: number;
            newListFilters?: ListFilters<Partial<IUserColumnName>>;
            newSortedColumn?: ISortedColumn<IUserColumnName>;
        }) {
            const { state } = this.props;
            const pageData = getAsyncUsersPageData(state);
            const filtersFromState = getUsersListFilter(state);

            const filters = newListFilters || filtersFromState.filters;
            const page = newListFilters ? 1 : newPage || pageData.number;
            const sortedColumn = newSortedColumn || filtersFromState.sortedColumn || defaultSortedColumn;

            triggerFetchUsers({
                pagination: { page },
                filter: {
                    username: filters.username.values.length > 0
                        && filters.username.values[0].toString(),
                },
                sort: formatSortQueryParameter(sortedColumn),
            });
        }
    },
);

function mapUsersToListItems(users: IUser[]): IListItem<IUserColumnName>[] {
    return users.map((user) => ({
        id: getUniqueIdFromUser(user),
        columns: {
            username: user.username,
            enabled: user.enabled ? 'Yes' : 'No',
            expired: user.expired ? 'Yes' : 'No',
            locked: user.locked ? 'Yes' : 'No',
            teams: {
                value: user.teams.length,
                tooltip: user.teams.length > 0 && (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={user.teams.map((team) => ({
                                content: team.name,
                            }))}
                        />
                    </Typography>
                ),
            },
        },
    }));
}

export default observe<TProps>([
    StateChangeNotification.IAM_USERS_LIST,
    StateChangeNotification.LIST_FILTER_USERS,
], UsersOverview);
