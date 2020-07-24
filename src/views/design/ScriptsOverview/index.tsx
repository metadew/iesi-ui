import React, { ReactText } from 'react';
import {
    Typography,
    Box,
    Theme,
    createStyles,
    withStyles,
    WithStyles,
    Button,
} from '@material-ui/core';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import AppTemplateContainer from 'views/appShell/AppTemplateContainer';
import GenericList from 'views/common/list/GenericList';
import GenericSort from 'views/common/list/GenericSort';
import { getTranslator } from 'state/i18n/selectors';
import { Edit, Delete, PlayArrowRounded, AddRounded } from '@material-ui/icons';
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
} from 'models/list.models';
import { IScript } from 'models/state/scripts.models';
import { ExecutionRequestStatus } from 'models/state/executionRequests.models';
import ContentWithSlideoutPanel from 'views/common/layout/ContentWithSlideoutPanel';
import GenericFilter from 'views/common/list/GenericFilter';
import { getIntialFiltersFromFilterConfig } from 'utils/list/filters';
import { redirectTo, ROUTE_KEYS } from 'views/routes';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
import { observe, IObserveProps } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { getAsyncScripts, getAsyncScriptDetail } from 'state/entities/scripts/selectors';
import { AsyncStatus, AsyncOperation } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import OrderedList from 'views/common/list/OrderedList';
import { Alert } from '@material-ui/lab';
import { triggerDeleteScriptDetail, triggerFetchScripts } from 'state/entities/scripts/triggers';
import { getUniqueIdFromScript } from 'utils/scripts/scripts';
import { triggerResetAsyncExecutionRequest } from 'state/entities/executionRequests/triggers';
import ExecuteScriptDialog from './ExecuteScriptDialog';


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
        scriptLabels: {
            fontWeight: typography.fontWeightBold,
        },
        scriptNew: {
            fontWeight: typography.fontWeightBold,
            color: palette.primary.main,
        },
        scriptSuccess: {
            fontWeight: typography.fontWeightBold,
            color: palette.secondary.main,
        },
        scriptFailed: {
            fontWeight: typography.fontWeightBold,
            color: palette.error.main,
        },
    });

interface IColumnNames {
    name: string;
    version: string;
    description: string;
    lastRunStatus: string;
    labels: number;
}

const filterConfig: FilterConfig<Partial<IColumnNames>> = {
    lastRunStatus: {
        label: <Translate msg="scripts.overview.list.filter.last_run_status" />,
        filterType: FilterType.Select,
    },
    name: {
        label: <Translate msg="scripts.overview.list.filter.script_name" />,
        filterType: FilterType.Search,
    },
    labels: {
        label: <Translate msg="scripts.overview.list.filter.script_label" />,
        filterType: FilterType.Includes,
    },
};

const sortActions: SortActions<Partial<IColumnNames>> = {
    name: {
        label: <Translate msg="scripts.overview.list.sort.script_name" />,
        sortType: SortType.String,
    },
};

interface IComponentState {
    sortedColumn: ISortedColumn<IColumnNames>;
    filters: ListFilters<Partial<IColumnNames>>;
    scriptIdToDelete: string;
    scriptIdToExecute: string;
}

type TProps = WithStyles<typeof styles>;

const ScriptsOverview = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, IComponentState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);

            this.state = {
                sortedColumn: null,
                filters: getIntialFiltersFromFilterConfig(filterConfig),
                scriptIdToDelete: null,
                scriptIdToExecute: null,
            };

            this.renderPanel = this.renderPanel.bind(this);
            this.renderContent = this.renderContent.bind(this);
            this.onSort = this.onSort.bind(this);
            this.onFilter = this.onFilter.bind(this);

            this.clearScriptToDelete = this.clearScriptToDelete.bind(this);
            this.setScriptToDelete = this.setScriptToDelete.bind(this);
            this.onCloseExecuteDialog = this.onCloseExecuteDialog.bind(this);
            this.setScriptToExecute = this.setScriptToExecute.bind(this);

            this.onDeleteScript = this.onDeleteScript.bind(this);
            // eslint-disable-next-line max-len
            this.closeDeleteScriptDialogAfterSuccessfulDelete = this.closeDeleteScriptDialogAfterSuccessfulDelete.bind(this);
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            this.closeDeleteScriptDialogAfterSuccessfulDelete(prevProps);
        }

        public render() {
            const { classes, state } = this.props;
            const { sortedColumn, scriptIdToDelete, scriptIdToExecute } = this.state;

            const scripts = getAsyncScripts(this.props.state).data;
            const deleteStatus = getAsyncScriptDetail(this.props.state).remove.status;

            const listItems = scripts
                ? mapScriptsToListItems(this.props.state.entities.scripts.data)
                : [];

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
                                        msg="scripts.overview.header.amount"
                                        placeholders={{ amount: listItems.length }}
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
                                    <Box flex="0 0 auto">
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            startIcon={<AddRounded />}
                                            onClick={() => redirectTo({ routeKey: ROUTE_KEYS.R_SCRIPT_NEW })}
                                        >
                                            <Translate msg="scripts.overview.header.add_button" />
                                        </Button>
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
                    <ConfirmationDialog
                        title={translator('scripts.overview.delete_script_dialog.title')}
                        text={translator('scripts.overview.delete_script_dialog.text')}
                        open={!!scriptIdToDelete}
                        onClose={this.clearScriptToDelete}
                        onConfirm={this.onDeleteScript}
                        showLoader={deleteStatus === AsyncStatus.Busy}
                    />
                    <ExecuteScriptDialog
                        scriptUniqueId={scriptIdToExecute}
                        open={!!scriptIdToExecute}
                        onClose={this.onCloseExecuteDialog}
                    />
                </>
            );
        }

        private renderPanel({ listItems }: { listItems: IListItem<IColumnNames>[] }) {
            return (
                <GenericFilter
                    filterConfig={filterConfig}
                    onFilterChange={this.onFilter}
                    listItems={listItems}
                />
            );
        }

        private renderContent({ listItems }: { listItems: IListItem<IColumnNames>[] }) {
            const { classes } = this.props;
            const { sortedColumn, filters } = this.state;
            const columns: ListColumns<IColumnNames> = {
                name: {
                    className: classes.scriptName,
                    fixedWidth: '16%',
                },
                version: {
                    className: classes.scriptVersion,
                    fixedWidth: '7%',
                },
                description: {
                    className: classes.scriptDescription,
                    tooltip: (value) => value,
                    fixedWidth: '26%',
                },
                lastRunStatus: {
                    fixedWidth: '17%',
                    label: (
                        <Translate msg="scripts.overview.list.labels.last_run_status" />
                    ),
                    className: (value) => {
                        if (value === ExecutionRequestStatus.New || value === ExecutionRequestStatus.Submitted) {
                            return classes.scriptNew;
                        }
                        if (value === ExecutionRequestStatus.Completed || value === ExecutionRequestStatus.Accepted) {
                            return classes.scriptSuccess;
                        }
                        if (value === ExecutionRequestStatus.Aborted || value === ExecutionRequestStatus.Declined) {
                            return classes.scriptFailed;
                        }
                        return '';
                    },
                    hideOnCompactView: true,
                },
                labels: {
                    label: (
                        <Translate msg="scripts.overview.list.labels.labels" />
                    ),
                    className: classes.scriptLabels,
                    fixedWidth: '8%',
                },
            };

            const scriptsFetchData = getAsyncScripts(this.props.state).fetch;
            const isFetching = scriptsFetchData.status === AsyncStatus.Busy;
            const hasError = scriptsFetchData.status === AsyncStatus.Error;

            return (
                <>
                    <Box paddingBottom={5} marginX={2.8}>
                        { !hasError && (
                            <GenericList
                                listActions={[
                                    {
                                        icon: <PlayArrowRounded />,
                                        label: <Translate msg="scripts.overview.list.actions.execute" />,
                                        // eslint-disable-next-line no-alert
                                        onClick: this.setScriptToExecute,
                                    }, {
                                        icon: <Edit />,
                                        label: <Translate msg="scripts.overview.list.actions.edit" />,
                                        onClick: (id) => {
                                            const scripts = getAsyncScripts(this.props.state).data;
                                            const selectedScript = scripts.find((item) => item.name === id);
                                            redirectTo({
                                                routeKey: ROUTE_KEYS.R_SCRIPT_DETAIL,
                                                params: {
                                                    name: selectedScript.name,
                                                    version: selectedScript.version.number,
                                                },
                                            });
                                        },
                                    }, {
                                        icon: <ReportIcon />,
                                        label: <Translate msg="scripts.overview.list.actions.report" />,
                                        onClick: (id) => {
                                            const scripts = getAsyncScripts(this.props.state).data;
                                            const selectedScript = scripts.find((item) => item.name === id);
                                            redirectTo({
                                                routeKey: ROUTE_KEYS.R_REPORTS,
                                                queryParams: {
                                                    name: selectedScript.name,
                                                    version: selectedScript.version.number,
                                                },
                                            });
                                        },
                                    }, {
                                        icon: <Delete />,
                                        label: <Translate msg="scripts.overview.list.actions.delete" />,
                                        onClick: this.setScriptToDelete,
                                    },
                                ]}
                                columns={columns}
                                sortedColumn={sortedColumn}
                                filters={filters}
                                listItems={listItems}
                                enablePagination
                                isLoading={isFetching}
                            />
                        )}

                        {hasError && (
                            <Box padding={2}>
                                <Alert severity="error">
                                    <Translate msg="scripts.overview.list.fetch_error" />
                                </Alert>
                            </Box>
                        )}

                    </Box>
                </>
            );
        }

        private onDeleteScript() {
            const { state } = this.props;
            const { scriptIdToDelete } = this.state;
            const scriptToDelete = getAsyncScripts(state).data.find((item) =>
                getUniqueIdFromScript(item) === scriptIdToDelete);

            if (scriptToDelete) {
                triggerDeleteScriptDetail({ name: scriptToDelete.name, version: scriptToDelete.version.number });
            }
        }

        private closeDeleteScriptDialogAfterSuccessfulDelete(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncScriptDetail(this.props.state).remove;
            const prevStatus = getAsyncScriptDetail(prevProps.state).remove.status;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                this.clearScriptToDelete();
                triggerFetchScripts({ expandResponseWith: { scheduling: false } });
            }
        }

        private onSort(sortedColumn: ISortedColumn<IColumnNames>) {
            this.setState({ sortedColumn });
        }

        private onFilter(listFilters: ListFilters<Partial<IColumnNames>>) {
            this.setState({ filters: listFilters });
        }

        private clearScriptToDelete() {
            this.setState({ scriptIdToDelete: null });
        }

        private setScriptToDelete(id: ReactText) {
            this.setState({ scriptIdToDelete: id as string });
        }

        private onCloseExecuteDialog() {
            triggerResetAsyncExecutionRequest({ operation: AsyncOperation.create });
            this.setState({ scriptIdToExecute: null });
        }

        private setScriptToExecute(id: ReactText) {
            this.setState({ scriptIdToExecute: id as string });
        }
    },
);

function mapScriptsToListItems(scripts: IScript[]): IListItem<IColumnNames>[] {
    return scripts.map((script) => ({
        id: getUniqueIdFromScript(script),
        columns: {
            name: script.name,
            description: script.description,
            version: (script.version.number).toString(),
            labels: {
                value: script.labels.length,
                tooltip: script.labels.length > 0 && (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={script.labels.map((label) => ({
                                content: `${label.name}:${label.value}`,
                            }))}
                        />
                    </Typography>
                ),
                includesFilterValues: script.labels.map((item) => item.name),
            },
            lastRunStatus: script.execution.mostRecent[0]?.runStatus,
        },
    }));
}

export default observe<TProps>([
    StateChangeNotification.DESIGN_SCRIPTS_LIST,
    StateChangeNotification.DESIGN_SCRIPTS_DETAIL,
    StateChangeNotification.I18N_TRANSLATIONS,
], ScriptsOverview);
