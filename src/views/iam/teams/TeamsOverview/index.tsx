import React from 'react';
import { IObserveProps, observe } from 'views/observe';
import { Box, Button, createStyles, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import { ITeam, ITeamColumnNames } from 'models/state/team.model';
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
import { getTeamsListFilter } from 'state/ui/selectors';
import { getIntialFiltersFromFilterConfig } from 'utils/list/filters';
import {
    getAsyncTeamDetail,
    getAsyncTeams,
    getAsyncTeamsEntity,
    getAsyncTeamsPageData,
} from 'state/entities/teams/selectors';
import { triggerDeleteTeamDetail, triggerFetchTeams } from 'state/entities/teams/triggers';
import { formatSortQueryParameter } from 'utils/core/string/format';
import { setTeamsListFilter } from 'state/ui/actions';
import { getUniqueIdFromTeam } from 'utils/teams/teamUtils';
import OrderedList from 'views/common/list/OrderedList';
import { StateChangeNotification } from 'models/state.models';
import AppTemplateContainer from 'views/appShell/AppTemplateContainer';
import GenericSort from 'views/common/list/GenericSort';
import { AddRounded, Delete, Edit, Visibility } from '@material-ui/icons';
import { checkAuthority } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import ContentWithSlideoutPanel from 'views/common/layout/ContentWithSlideoutPanel';
import GenericFilter from 'views/common/list/GenericFilter';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { getTranslator } from 'state/i18n/selectors';
import GenericList from 'views/common/list/GenericList';
import { Alert } from '@material-ui/lab';
import { redirectTo, ROUTE_KEYS } from 'views/routes';

const styles = ({ palette, typography }: Theme) => createStyles({
    header: {
        backgroundColor: palette.background.paper,
        borderBottom: '1px solid',
        borderBottomColor: palette.grey[200],
    },
    teamName: {
        fontWeight: typography.fontWeightBold,
        color: palette.primary.main,
    },
    securityGroups: {
        fontWeight: typography.fontWeightBold,
    },
    users: {
        fontWeight: typography.fontWeightBold,
    },
});

type TProps = WithStyles<typeof styles>;

interface IComponentState {
    teamIdToDelete: string;
}

const defaultSortedColumn: ISortedColumn<ITeamColumnNames> = {
    name: 'name',
    sortOrder: SortOrder.Descending,
    sortType: SortType.String,
};

const filterConfig: FilterConfig<Partial<ITeamColumnNames>> = {
    name: {
        label: <Translate msg="teams.overview.list.filter.team_name" />,
        filterType: FilterType.Search,
    },
};

const sortActions: SortActions<Partial<ITeamColumnNames>> = {
    name: {
        label: <Translate msg="teams.overview.list.sort.team_name" />,
        sortType: SortType.String,
    },
};

const TeamsOverview = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, IComponentState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);

            this.state = {
                teamIdToDelete: null,
            };

            this.combineFiltersFromUrlAndCurrentFilters = this.combineFiltersFromUrlAndCurrentFilters.bind(this);
            this.fetchTeamsWithFilterAndPagination = this.fetchTeamsWithFilterAndPagination.bind(this);
            // eslint-disable-next-line max-len
            this.closeDeleteTeamDialogAfterSuccessfulDelete = this.closeDeleteTeamDialogAfterSuccessfulDelete.bind(this);

            this.onFilter = this.onFilter.bind(this);
            this.onSort = this.onSort.bind(this);
            this.onDeleteTeam = this.onDeleteTeam.bind(this);

            this.renderPanel = this.renderPanel.bind(this);
            this.renderContent = this.renderContent.bind(this);
        }

        public componentDidMount() {
            const { dispatch } = this.props;
            const initialFilters = this.combineFiltersFromUrlAndCurrentFilters();

            this.fetchTeamsWithFilterAndPagination({ newListFilters: initialFilters, newPage: 1 });
            dispatch(setTeamsListFilter({ filters: initialFilters }));
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            const { state, dispatch } = prevProps;
            const filterFromState = getTeamsListFilter(state);

            if (filterFromState.filters === null || filterFromState.sortedColumn === null) {
                dispatch(setTeamsListFilter({
                    filters: filterFromState.filters === null && getIntialFiltersFromFilterConfig(filterConfig),
                    sortedColumn: filterFromState.sortedColumn === null && {
                        name: 'name',
                        sortOrder: SortOrder.Descending,
                        sortType: SortType.String,
                    },
                }));
            }

            this.closeDeleteTeamDialogAfterSuccessfulDelete(prevProps);
        }

        public render() {
            const { classes, state } = this.props;
            const { teamIdToDelete } = this.state;
            const pageData = getAsyncTeamsPageData(state);
            const filterFromState = getTeamsListFilter(state);
            const teams = getAsyncTeams(state);
            const listItems = mapTeamsToListItems(teams);
            const translator = getTranslator(state);
            const deleteStatus = getAsyncTeamDetail(state).remove.status;

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
                                        msg="teams.overview.header.amount"
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
                                        checkAuthority(state, SECURITY_PRIVILEGES.S_TEAMS_WRITE) && (
                                            <Box display="flex" alignItems="center">
                                                <Box flex="0 0 auto">
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        startIcon={<AddRounded />}
                                                        onClick={() => {
                                                            redirectTo({
                                                                routeKey: ROUTE_KEYS.R_TEAM_NEW,
                                                            });
                                                        }}
                                                    >
                                                        <Translate msg="teams.overview.header.add_button" />
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
                                        && (filterFromState.filters.name.values.length > 0))
                                }
                            />
                            <ConfirmationDialog
                                title={translator('teams.overview.delete_team_dialog.title')}
                                text={translator('teams.overview.delete_team_dialog.text')}
                                open={!!teamIdToDelete}
                                onClose={() => this.setState({ teamIdToDelete: null })}
                                onConfirm={this.onDeleteTeam}
                                showLoader={deleteStatus === AsyncStatus.Busy}
                            />
                        </Box>
                    </Box>
                </>
            );
        }

        private renderPanel({ listItems }: { listItems: IListItem<ITeamColumnNames>[] }) {
            const { state } = this.props;
            const filterFromState = getTeamsListFilter(state);

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

        private renderContent({ listItems }: { listItems: IListItem<ITeamColumnNames>[] }) {
            const { state, classes, dispatch } = this.props;
            const asyncTeamsEntity = getAsyncTeamsEntity(state);
            const teamsFetchData = asyncTeamsEntity.fetch;
            const isFetching = teamsFetchData.status === AsyncStatus.Busy;
            const hasError = teamsFetchData.status === AsyncStatus.Error;
            const teamsData = asyncTeamsEntity.data;
            const pageData = teamsData ? teamsData.page : null;
            const translator = getTranslator(state);

            const columns: ListColumns<ITeamColumnNames> = {
                name: {
                    label: <Translate msg="teams.overview.list.labels.team_name" />,
                    className: classes.teamName,
                    fixedWidth: '80%',
                },
                securityGroups: {
                    label: <Translate msg="teams.overview.list.labels.securityGroups" />,
                    className: classes.securityGroups,
                    fixedWidth: '5%',
                },
                users: {
                    label: <Translate msg="teams.overview.list.labels.users" />,
                    className: classes.users,
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
                                            this.fetchTeamsWithFilterAndPagination({ newPage: page });
                                            dispatch(setTeamsListFilter({ page }));
                                        },
                                    }}
                                    listActions={[].concat({
                                        icon: <Edit />,
                                        label: translator('teams.overview.list.actions.edit'),
                                        onClick: (id: string) => {
                                            const teams = getAsyncTeams(state);
                                            const selectedTeam = teams.find((team: ITeam) =>
                                                getUniqueIdFromTeam(team) === id);
                                            redirectTo({
                                                routeKey: ROUTE_KEYS.R_TEAM_DETAIL,
                                                params: {
                                                    name: selectedTeam.teamName,
                                                },
                                            });
                                        },
                                        hideAction: () =>
                                            !checkAuthority(state, SECURITY_PRIVILEGES.S_TEAMS_WRITE),
                                    }, {
                                        icon: <Visibility />,
                                        label: translator('teams.overview.list.actions.view'),
                                        onClick: (id: string) => {
                                            const teams = getAsyncTeams(state);
                                            const selectedTeam = teams.find((team: ITeam) =>
                                                getUniqueIdFromTeam(team) === id);
                                            redirectTo({
                                                routeKey: ROUTE_KEYS.R_TEAM_DETAIL,
                                                params: {
                                                    name: selectedTeam.teamName,
                                                },
                                            });
                                        },
                                        hideAction: () =>
                                            checkAuthority(state, SECURITY_PRIVILEGES.S_TEAMS_WRITE),
                                    }, {
                                        icon: <Delete />,
                                        label: translator('teams.overview.list.actions.delete'),
                                        onClick: (id: string) => {
                                            const teams = getAsyncTeams(state);
                                            const selectedTeam = teams.find((team: ITeam) =>
                                                getUniqueIdFromTeam(team) === id);
                                            this.setState({ teamIdToDelete: selectedTeam.id });
                                        },
                                        hideAction: () =>
                                            !checkAuthority(state, SECURITY_PRIVILEGES.S_TEAMS_WRITE),
                                    })}
                                />
                            ) : (
                                <Box padding={2}>
                                    <Alert severity="error">
                                        <Translate msg="teams.overview.list.fetch_error" />
                                    </Alert>
                                </Box>
                            )
                        }
                    </Box>
                </>
            );
        }

        private combineFiltersFromUrlAndCurrentFilters() {
            const { state } = this.props;
            const filterFromState = getTeamsListFilter(state);
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
                            if (!filtersByUrlSearchParams[searchParamKey as keyof ITeamColumnNames]
                                .values.includes(filterValue)) {
                                filtersByUrlSearchParams[searchParamKey as keyof ITeamColumnNames]
                                    .values.push(filterValue);
                            }
                        }
                    },
                );
                return filtersByUrlSearchParams;
            }
            return defaultFilters;
        }

        private onDeleteTeam() {
            const { teamIdToDelete } = this.state;

            if (teamIdToDelete) {
                triggerDeleteTeamDetail({ id: teamIdToDelete });
            }
        }

        private onFilter(listFilters: ListFilters<Partial<ITeamColumnNames>>) {
            const { dispatch } = this.props;
            this.fetchTeamsWithFilterAndPagination({ newListFilters: listFilters });
            dispatch(setTeamsListFilter({ filters: listFilters }));
        }

        private onSort(sortedColumn: ISortedColumn<ITeamColumnNames>) {
            const { dispatch } = this.props;
            this.fetchTeamsWithFilterAndPagination({ newSortedColumn: sortedColumn });
            dispatch(setTeamsListFilter({ sortedColumn }));
        }

        private closeDeleteTeamDialogAfterSuccessfulDelete(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncTeamDetail(this.props.state).remove;
            const prevStatus = getAsyncTeamDetail(prevProps.state).remove.status;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                this.setState({ teamIdToDelete: null });
                this.fetchTeamsWithFilterAndPagination({});
            }
        }

        private fetchTeamsWithFilterAndPagination({
            newPage,
            newListFilters,
            newSortedColumn,
        }: {
            newPage?: number;
            newListFilters?: ListFilters<Partial<ITeamColumnNames>>;
            newSortedColumn?: ISortedColumn<ITeamColumnNames>;
        }) {
            const { state } = this.props;
            const pageData = getAsyncTeamsPageData(state);
            const filtersFromState = getTeamsListFilter(state);

            const filters = newListFilters || filtersFromState.filters;
            const page = newListFilters ? 1 : newPage || pageData.number;
            const sortedColumn = newSortedColumn || filtersFromState.sortedColumn || defaultSortedColumn;

            triggerFetchTeams({
                pagination: { page },
                filter: {
                    name: filters.name.values.length > 0
                        && filters.name.values[0].toString(),
                },
                sort: formatSortQueryParameter(sortedColumn),
            });
        }
    },
);

function mapTeamsToListItems(teams: ITeam[]): IListItem<ITeamColumnNames>[] {
    return teams.map((team) => ({
        id: getUniqueIdFromTeam(team),
        columns: {
            name: team.teamName,
            securityGroups: {
                value: team.securityGroups.length,
                tooltip: team.securityGroups.length > 0 && (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={team.securityGroups.map((securityGroup) => ({
                                content: securityGroup.name,
                            }))}
                        />
                    </Typography>
                ),
            },
            users: team.users.length,
        },
    }));
}

export default observe<TProps>([
    StateChangeNotification.IAM_TEAMS_LIST,
    StateChangeNotification.IAM_TEAMS_DETAIL,
], TeamsOverview);
