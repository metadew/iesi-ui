import React, { ReactText } from 'react';
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
import { IExecutionRequest, ExecutionRequestStatus } from 'models/state/executionRequests.models';
import { Alert } from '@material-ui/lab';
import { parseISO, format as formatDate } from 'date-fns/esm';
import OrderedList from 'views/common/list/OrderedList';
import {
    isExecutionRequestStatusNewOrSubmitted,
    isExecutionRequestStatusAbortedOrDeclined,
} from 'utils/scripts/executionRequests';
import {
    getAsyncExecutionRequestsEntity,
    getAsyncExecutionRequests,
    getAsyncExecutionRequestsPageData,
} from 'state/entities/executionRequests/selectors';
import { triggerFetchExecutionRequests } from 'state/entities/executionRequests/triggers';

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
        scriptVersion: {
            fontWeight: typography.fontWeightBold,
        },
        scriptDescription: {
            fontWeight: typography.fontWeightBold,
            fontSize: typography.pxToRem(12),
        },
        scriptSchedules: {
            fontWeight: typography.fontWeightBold,
        },
        scriptLabels: {
            fontWeight: typography.fontWeightBold,
        },
        scriptParameters: {
            fontWeight: typography.fontWeightBold,
        },
        scriptSuccess: {
            fontWeight: typography.fontWeightBold,
            color: palette.secondary.main,
        },
        scriptFailed: {
            fontWeight: typography.fontWeightBold,
            color: palette.error.main,
        },
        scriptNew: {
            fontWeight: typography.fontWeightBold,
            color: palette.primary.main,
        },
    });

interface IColumnNames {
    name: string;
    version: string;
    environment: string;
    requestTimestamp: string;
    executionStatus: string;
    labels: number;
    parameters: number;
}

const filterConfig: FilterConfig<Partial<IColumnNames>> = {
    name: {
        label: <Translate msg="script_reports.overview.list.filter.script_name" />,
        filterType: FilterType.Search,
    },
    version: {
        label: <Translate msg="script_reports.overview.list.filter.script_version" />,
        filterType: FilterType.Search,
    },
    environment: {
        label: <Translate msg="script_reports.overview.list.filter.environment" />,
        filterType: FilterType.Select,
    },
    labels: {
        label: <Translate msg="script_reports.overview.list.filter.labels" />,
        filterType: FilterType.Search,
    },
};

const sortActions: SortActions<Partial<IColumnNames>> = {
    name: {
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

interface IComponentState {
    sortedColumn: ISortedColumn<IColumnNames>;
    filters: ListFilters<Partial<IColumnNames>>;
    initialFilters: ListFilters<Partial<IColumnNames>>;
    idOfScriptToDelete: ReactText;
}

type TProps = WithStyles<typeof styles>;

const ScriptReportsOverview = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, IComponentState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);

            this.state = {
                sortedColumn: {
                    name: 'requestTimestamp',
                    sortOrder: SortOrder.Descending,
                    sortType: SortType.String,
                },
                filters: getIntialFiltersFromFilterConfig(filterConfig),
                idOfScriptToDelete: null,
                initialFilters: null,
            };

            this.renderPanel = this.renderPanel.bind(this);
            this.renderContent = this.renderContent.bind(this);
            this.onSort = this.onSort.bind(this);
            this.onFilter = this.onFilter.bind(this);
            this.combineFiltersFromUrlAndCurrentFilters = this.combineFiltersFromUrlAndCurrentFilters.bind(this);
        }

        public componentDidMount() {
            const initialFilters = this.combineFiltersFromUrlAndCurrentFilters();
            this.setState({ filters: initialFilters, initialFilters });
        }

        public render() {
            const { classes } = this.props;
            const { sortedColumn } = this.state;

            const pageData = getAsyncExecutionRequestsPageData(this.props.state);
            const executions = getAsyncExecutionRequests(this.props.state);
            const listItems = executions
                ? mapExecutionsToListItems(executions)
                : [];

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
                                            sortedColumn={sortedColumn as ISortedColumn<{}>}
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
                        />
                    </Box>
                </>
            );
        }

        private combineFiltersFromUrlAndCurrentFilters() {
            const searchParams = new URLSearchParams(window.location.search);
            const { filters } = this.state;
            const filtersByUrlSearchParams = filters;

            Array.from(searchParams.keys()).forEach((searchParamKey: string) => {
                if (Object.keys(filterConfig).includes(searchParamKey)) {
                    filtersByUrlSearchParams[searchParamKey as keyof IColumnNames].values
                        .push(searchParams.get(searchParamKey));
                }
            });

            return filtersByUrlSearchParams;
        }

        private renderPanel({ listItems }: { listItems: IListItem<IColumnNames>[] }) {
            const { initialFilters } = this.state;
            return (
                <GenericFilter
                    filterConfig={filterConfig}
                    onFilterChange={this.onFilter}
                    listItems={listItems}
                    initialFilters={initialFilters}
                />
            );
        }

        private renderContent({ listItems }: { listItems: IListItem<IColumnNames>[] }) {
            const { classes } = this.props;
            const { sortedColumn, filters } = this.state;
            const columns: ListColumns<IColumnNames> = {
                name: {
                    className: classes.scriptName,
                    fixedWidth: '25%',
                },
                version: {
                    className: classes.scriptVersion,
                    fixedWidth: '7%',
                },
                environment: {
                    label: (
                        <Translate msg="script_reports.overview.list.labels.environment" />
                    ),
                    fixedWidth: '20%',
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
                        if (isExecutionRequestStatusNewOrSubmitted(executionStatus)) {
                            return classes.scriptNew;
                        }
                        if (isExecutionRequestStatusAbortedOrDeclined(executionStatus)) {
                            return classes.scriptFailed;
                        }
                        return classes.scriptSuccess;
                    },
                    hideOnCompactView: true,
                },
                labels: {
                    label: (
                        <Translate msg="script_reports.overview.list.labels.labels" />
                    ),
                    className: classes.scriptLabels,
                    hideOnCompactView: true,
                    fixedWidth: '8%',
                },
                parameters: {
                    label: (
                        <Translate msg="script_reports.overview.list.labels.parameters" />
                    ),
                    className: classes.scriptParameters,
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
                                label: <Translate msg="script_reports.overview.list.actions.report" />,
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
                            },
                        ]}
                        columns={columns}
                        sortedColumn={sortedColumn}
                        filters={filters}
                        listItems={listItems}
                        pagination={{
                            pageData,
                            onChange: ({ page }) => triggerFetchExecutionRequests({
                                pagination: { page },
                            }),
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
            this.setState({ sortedColumn });
        }

        private onFilter(listFilters: ListFilters<Partial<IColumnNames>>) {
            this.setState({ filters: listFilters });
        }
    },
);

function mapExecutionsToListItems(executionRequests: IExecutionRequest[]): IListItem<IColumnNames>[] {
    return executionRequests.reduce(
        (acc, executionRequest) => {
            const { scriptExecutionRequests } = executionRequest;
            scriptExecutionRequests.forEach((scriptExecution) => {
                acc.push({
                    id: scriptExecution.executionRequestId,
                    columns: {
                        name: scriptExecution.scriptName,
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
                    },
                    data: {
                        runId: scriptExecution.runId,
                    },
                });
            });
            return acc;
        },
        [] as IListItem<IColumnNames>[],
    );
}

export default observe<TProps>([StateChangeNotification.EXECUTION_REQUESTS_LIST], ScriptReportsOverview);
