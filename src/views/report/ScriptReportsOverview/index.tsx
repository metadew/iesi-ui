import React from 'react';
import {
    Typography,
    Box,
    Theme,
    createStyles,
    withStyles,
    WithStyles,
} from '@material-ui/core';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import AppTemplateContainer from 'views/appShell/AppTemplateContainer';
import GenericList from 'views/common/list/GenericList';
import GenericSort from 'views/common/list/GenericSort';
import { WatchLater } from '@material-ui/icons';
import { redirectTo, ROUTE_KEYS } from 'views/routes';
import ReportIcon from 'views/common/icons/Report';
import {
    ListColumns,
    ISortedColumn,
    SortActions,
    SortType,
    FilterType,
    ListFilters,
    FilterConfig,
    IListItem,
    SortOrder,
} from 'models/list.models';
import ContentWithSlideoutPanel from 'views/common/layout/ContentWithSlideoutPanel';
import GenericFilter from 'views/common/list/GenericFilter';
import { getIntialFiltersFromFilterConfig } from 'utils/list/filters';
import { observe, IObserveProps } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { IColumnNames, IExecutionRequest } from 'models/state/executionRequests.models';
import { ExecutionRequestStatus } from 'models/state/executionRequestStatus.models';
import { ExecutionActionStatus } from 'models/state/executionActionStatus.models';
import { Alert } from '@material-ui/lab';
import { parseISO, format as formatDate } from 'date-fns';
import OrderedList from 'views/common/list/OrderedList';
import { statusColorAndIconMap, StatusColors } from 'config/statusColorsAndIcons.config';
import {
    getAsyncExecutionRequestsEntity,
    getAsyncExecutionRequests,
    getAsyncExecutionRequestsPageData,
} from 'state/entities/executionRequests/selectors';
import { triggerFetchExecutionRequests } from 'state/entities/executionRequests/triggers';
import { formatSortQueryParameter } from 'utils/core/string/format';
import { getEnvironmentsForDropdown } from 'state/entities/environments/selectors';
import { getTranslator } from 'state/i18n/selectors';
import { getExecutionsListFilter } from 'state/ui/selectors';
import { setExecutionsListFilter } from 'state/ui/actions';

const styles = ({ palette, typography }: Theme) =>
    createStyles({
        header: {
            backgroundColor: palette.background.paper,
            borderBottom: '1px solid',
            borderBottomColor: palette.grey[200],
        },
        scriptName: {
            fontWeight: typography.fontWeightBold,
            color: palette.primary.main,
        },
        securityGroupName: {
            fontWeight: typography.fontWeightBold,
            fontSize: typography.pxToRem(12),
        },
        scriptVersion: {
            fontWeight: typography.fontWeightBold,
        },
        executionLabels: {
            fontWeight: typography.fontWeightBold,
        },
        executionParameters: {
            fontWeight: typography.fontWeightBold,
        },
        executionStatus: {
            fontWeight: typography.fontWeightBold,
            [`&.${StatusColors.Success}`]: {
                color: palette.success.main,
            },
            [`&.${StatusColors.SuccessDark}`]: {
                color: palette.success.dark,
            },
            [`&.${StatusColors.Warning}`]: {
                color: palette.warning.main,
            },
            [`&.${StatusColors.Error}`]: {
                color: palette.error.main,
            },
            [`&.${StatusColors.Primary}`]: {
                color: palette.primary.main,
            },
        },
        runStatus: {
            fontWeight: typography.fontWeightBold,
            [`&.${StatusColors.Success}`]: {
                color: palette.success.main,
            },
            [`&.${StatusColors.Error}`]: {
                color: palette.error.main,
            },
            [`&.${StatusColors.Warning}`]: {
                color: palette.warning.main,
            },
            [`&.${StatusColors.Error}`]: {
                color: palette.error.main,
            },
            [`&.${StatusColors.Primary}`]: {
                color: palette.primary.main,
            },
        },
    });

const filterConfig: FilterConfig<Partial<IColumnNames>> = {
    script: {
        label: <Translate msg="script_reports.overview.list.filter.script_name" />,
        filterType: FilterType.Search,
    },
    version: {
        label: <Translate msg="script_reports.overview.list.filter.script_version" />,
        filterType: FilterType.Search,
    },
    environment: {
        label: <Translate msg="script_reports.overview.list.filter.environment" />,
        filterType: FilterType.Dropdown,
        getDropdownOptions: getEnvironmentsForDropdown,
    },
    labels: {
        label: <Translate msg="script_reports.overview.list.filter.labels" />,
        filterType: FilterType.KeyValue,
    },
};

const sortActions: SortActions<Partial<IColumnNames>> = {
    script: {
        label: <Translate msg="script_reports.overview.list.sort.script_name" />,
        sortType: SortType.String,
    },
    version: {
        label: <Translate msg="script_reports.overview.list.sort.version" />,
        sortType: SortType.DotSeparatedNumber,
    },
    requestTimestamp: {
        label: <Translate msg="script_reports.overview.list.sort.request_timestamp" />,
        sortType: SortType.String,
    },
};

const defaultSortedColumn: ISortedColumn<IColumnNames> = {
    name: 'requestTimestamp',
    sortOrder: SortOrder.Descending,
    sortType: SortType.String,
};

type TProps = WithStyles<typeof styles>;

const ScriptReportsOverview = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps> {
        public constructor(props: TProps & IObserveProps) {
            super(props);

            this.renderPanel = this.renderPanel.bind(this);
            this.renderContent = this.renderContent.bind(this);
            this.onSort = this.onSort.bind(this);
            this.onFilter = this.onFilter.bind(this);
            this.combineFiltersFromUrlAndCurrentFilters = this.combineFiltersFromUrlAndCurrentFilters.bind(this);

            // eslint-disable-next-line max-len
            this.fetchExecutionRequestsWithFilterAndPagination = this.fetchExecutionRequestsWithFilterAndPagination.bind(this);
        }

        public componentDidMount() {
            const { dispatch } = this.props;
            const initialFilters = this.combineFiltersFromUrlAndCurrentFilters();

            this.fetchExecutionRequestsWithFilterAndPagination({ newListFilters: initialFilters, newPage: 1 });
            dispatch(setExecutionsListFilter({ filters: initialFilters }));
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            const { state, dispatch } = prevProps;
            const filterFromState = getExecutionsListFilter(state);

            if (filterFromState.sortedColumn === null) {
                dispatch(setExecutionsListFilter({ sortedColumn: defaultSortedColumn }));
            }
        }

        public render() {
            const { classes, state } = this.props;

            const filterFromState = getExecutionsListFilter(state);
            const pageData = getAsyncExecutionRequestsPageData(state);
            const executions = getAsyncExecutionRequests(state);
            const listItems = executions
                ? mapExecutionsToListItems(executions)
                : [];
            const searchParams = new URLSearchParams(window.location.search);
            const hasValidUrlParams = Array.from(searchParams.keys()).some((r) =>
                Object.keys(filterConfig).includes(r));

            const initialIsOpenStateFilterPanel = hasValidUrlParams
                || (filterFromState.filters
                    && (filterFromState.filters.script.values.length > 0
                        || filterFromState.filters.version.values.length > 0
                        || filterFromState.filters.environment.values.length > 0
                        || filterFromState.filters.labels.values.length > 0));

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
                                        msg="script_reports.overview.header.amount"
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
                                </Box>
                            </AppTemplateContainer>
                        </Box>
                        <ContentWithSlideoutPanel
                            toggleLabel={
                                <Translate msg="common.list.filter.toggle" />
                            }
                            panel={this.renderPanel({ listItems })}
                            content={this.renderContent({ listItems })}
                            initialIsOpenState={initialIsOpenStateFilterPanel}
                        />
                    </Box>
                </>
            );
        }

        private combineFiltersFromUrlAndCurrentFilters() {
            const { state } = this.props;
            const filterFromState = getExecutionsListFilter(state);
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
                                !filtersByUrlSearchParams[searchParamKey as keyof IColumnNames]
                                    .values.includes(filterValue)
                            ) {
                                filtersByUrlSearchParams[searchParamKey as keyof IColumnNames].values.push(filterValue);
                            }
                        }
                    },
                );
                return filtersByUrlSearchParams;
            }

            return defaultFilters;
        }

        private renderPanel({ listItems }: { listItems: IListItem<IColumnNames, { runId: string }>[] }) {
            const { state } = this.props;
            const filterFromState = getExecutionsListFilter(state);

            return (
                <GenericFilter
                    filterConfig={filterConfig}
                    onFilterChange={this.onFilter}
                    listItems={listItems}
                    initialFilters={filterFromState.filters}
                />
            );
        }

        private renderContent({ listItems }: { listItems: IListItem<IColumnNames, { runId: string }>[] }) {
            const { classes, state, dispatch } = this.props;
            const translator = getTranslator(state);
            const columns: ListColumns<IColumnNames> = {
                script: {
                    className: classes.scriptName,
                    fixedWidth: '25%',
                },
                securityGroupName: {
                    className: classes.securityGroupName,
                    fixedWidth: '10%',
                },
                version: {
                    className: classes.scriptVersion,
                    fixedWidth: '5%',
                },
                environment: {
                    label: (
                        <Translate msg="script_reports.overview.list.labels.environment" />
                    ),
                    fixedWidth: '15%',
                },
                requestTimestamp: {
                    label: (
                        <Translate msg="script_reports.overview.list.labels.request_timestamp" />
                    ),
                    fixedWidth: '20%',
                    hideOnCompactView: true,
                    icon: <WatchLater />,
                },
                executionStatus: {
                    fixedWidth: '10%',
                    label: (
                        <Translate msg="script_reports.overview.list.labels.execution_status" />
                    ),
                    className: (value) => {
                        const executionStatus = value as ExecutionRequestStatus;
                        const currentStatus = statusColorAndIconMap[executionStatus];

                        return `${classes.executionStatus} ${currentStatus && currentStatus.color}`;
                    },
                    hideOnCompactView: true,
                },
                runStatus: {
                    fixedWidth: '10%',
                    label: (
                        <Translate msg="script_reports.overview.list.labels.run_status" />
                    ),
                    className: (value) => {
                        const runStatus = value as ExecutionActionStatus;
                        const currentStatus = statusColorAndIconMap[runStatus];

                        return `${classes.runStatus} ${currentStatus && currentStatus.color}`;
                    },
                    hideOnCompactView: true,
                },
                labels: {
                    label: (
                        <Translate msg="script_reports.overview.list.labels.labels" />
                    ),
                    className: classes.executionLabels,
                    hideOnCompactView: true,
                    fixedWidth: '5%',
                },
                parameters: {
                    label: (
                        <Translate msg="script_reports.overview.list.labels.parameters" />
                    ),
                    className: classes.executionParameters,
                    hideOnCompactView: true,
                    fixedWidth: '10%',
                },
            };

            const asyncExecutionRequestsEntity = getAsyncExecutionRequestsEntity(this.props.state);
            const executionsFetchData = asyncExecutionRequestsEntity.fetch;
            const isFetching = executionsFetchData.status === AsyncStatus.Busy;
            const hasError = executionsFetchData.status === AsyncStatus.Error;

            const executionRequestsData = asyncExecutionRequestsEntity.data;
            const pageData = executionRequestsData ? executionRequestsData.page : null;

            return !hasError ? (
                <Box paddingBottom={5} marginX={2.8}>
                    <GenericList
                        listActions={[
                            {
                                icon: <ReportIcon />,
                                label: translator('script_reports.overview.list.actions.report'),
                                onClick: (id) => {
                                    const execution = listItems.find((listItem) => listItem.id === id);

                                    redirectTo({
                                        routeKey: ROUTE_KEYS.R_REPORT_DETAIL,
                                        params: {
                                            executionRequestId: id,
                                            runId: execution && execution.data.runId,
                                        },
                                    });
                                },
                                hideAction: (id) => {
                                    const execution = listItems.find((listItem) => listItem.id === id);
                                    return execution.data.runId === null;
                                },
                            },
                        ]}
                        columns={columns}
                        listItems={listItems}
                        pagination={{
                            pageData,
                            onChange: ({ page }) => {
                                this.fetchExecutionRequestsWithFilterAndPagination({ newPage: page });
                                dispatch(setExecutionsListFilter({ page }));
                            },
                        }}
                        isLoading={isFetching}
                    />
                </Box>
            ) : (
                <Box padding={2}>
                    <Alert severity="error">
                        <Translate msg="script_reports.overview.list.fetch_error" />
                    </Alert>
                </Box>
            );
        }

        private onSort(sortedColumn: ISortedColumn<IColumnNames>) {
            const { dispatch } = this.props;
            this.fetchExecutionRequestsWithFilterAndPagination({ newSortedColumn: sortedColumn });
            dispatch(setExecutionsListFilter({ sortedColumn }));
        }

        private onFilter(listFilters: ListFilters<Partial<IColumnNames>>) {
            const { dispatch } = this.props;
            this.fetchExecutionRequestsWithFilterAndPagination({ newListFilters: listFilters });
            dispatch(setExecutionsListFilter({ filters: listFilters }));
        }

        private fetchExecutionRequestsWithFilterAndPagination({
            newPage,
            newListFilters,
            newSortedColumn,
        }: {
            newPage?: number;
            newListFilters?: ListFilters<Partial<IColumnNames>>;
            newSortedColumn?: ISortedColumn<IColumnNames>;
        }) {
            const { state } = this.props;
            const filtersFromState = getExecutionsListFilter(state);
            const pageData = getAsyncExecutionRequestsPageData(this.props.state);

            const filters = newListFilters || filtersFromState.filters;
            const page = newListFilters ? 1 : newPage || pageData.number;
            const sortedColumn = newSortedColumn || filtersFromState.sortedColumn || defaultSortedColumn;

            triggerFetchExecutionRequests({
                pagination: { page },
                filter: {
                    script: filters.script.values.length > 0
                        && filters.script.values[0].toString(),
                    version: filters.version.values.length > 0
                        && filters.version.values[0].toString(),
                    environment: filters.environment.values.length > 0
                        && filters.environment.values[0].toString(),
                    label: filters.labels.values.length > 0
                        && filters.labels.values[0].toString(),
                },
                sort: formatSortQueryParameter(sortedColumn),
            });
        }
    },
);

function mapExecutionsToListItems(
    executionRequests: IExecutionRequest[],
): IListItem<IColumnNames, { runId: string }>[] {
    return executionRequests.reduce(
        (acc, executionRequest) => {
            const { scriptExecutionRequests } = executionRequest;
            scriptExecutionRequests.forEach((scriptExecution) => {
                acc.push({
                    id: scriptExecution.executionRequestId,
                    columns: {
                        script: scriptExecution.scriptName,
                        version: (scriptExecution.scriptVersion).toString(),
                        environment: scriptExecution.environment,
                        requestTimestamp: {
                            value: formatDate(
                                parseISO(executionRequest.requestTimestamp.toString()),
                                'dd/MM/yyyy HH:mm:ss',
                            ),
                            sortValue: new Date(executionRequest.requestTimestamp).toISOString(),
                        },
                        executionStatus: executionRequest.executionRequestStatus,
                        runStatus: scriptExecution.runStatus
                            ? scriptExecution.runStatus : ExecutionActionStatus.Unknown,
                        labels: {
                            value: executionRequest.executionRequestLabels.length,
                            tooltip: executionRequest.executionRequestLabels.length > 0 && (
                                <Typography variant="body2" component="div">
                                    <OrderedList
                                        items={executionRequest.executionRequestLabels.map((label) => ({
                                            content: `${label.name}:${label.value}`,
                                        }))}
                                    />
                                </Typography>
                            ),
                        },
                        parameters: {
                            value: scriptExecution.parameters.length,
                            tooltip: scriptExecution.parameters.length > 0 && (
                                <Typography variant="body2" component="div">
                                    <OrderedList
                                        items={scriptExecution.parameters.map((parameter) => ({
                                            content: `${parameter.name}:${parameter.value}`,
                                        }))}
                                    />
                                </Typography>
                            ),
                        },
                        securityGroupName: scriptExecution.securityGroupName,
                    },
                    data: {
                        runId: scriptExecution.runId,
                    },
                });
            });
            return acc;
        },
        [] as IListItem<IColumnNames, { runId: string }>[],
    );
}

export default observe<TProps>([
    StateChangeNotification.EXECUTION_REQUESTS_LIST,
    StateChangeNotification.LIST_FILTER_EXECUTIONS,
], ScriptReportsOverview);
