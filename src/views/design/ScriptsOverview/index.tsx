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
import { Edit, Delete, PlayArrowRounded, AddRounded, WatchLater } from '@material-ui/icons';
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
import { IScriptBase } from 'models/state/scripts.models';
import ContentWithSlideoutPanel from 'views/common/layout/ContentWithSlideoutPanel';
import GenericFilter from 'views/common/list/GenericFilter';
import { getIntialFiltersFromFilterConfig } from 'utils/list/filters';
import { redirectTo, ROUTE_KEYS } from 'views/routes';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
import { observe, IObserveProps } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { getAsyncScripts } from 'state/entities/scripts/selectors';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import OrderedList from 'views/common/list/OrderedList';


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
    scheduling: number;
    description: string;
    lastRunDate: string;
    lastRunStatus: string;
    labels: number;
}

const filterConfig: FilterConfig<Partial<IColumnNames>> = {
    lastRunDate: {
        label: <Translate msg="scripts.overview.list.filter.last_run_date" />,
        filterType: FilterType.FromTo,
    },
    lastRunStatus: {
        label: <Translate msg="scripts.overview.list.filter.last_run_status" />,
        filterType: FilterType.Select,
    },
    name: {
        label: <Translate msg="scripts.overview.list.filter.script_name" />,
        filterType: FilterType.Search,
    },
};

const sortActions: SortActions<Partial<IColumnNames>> = {
    name: {
        label: <Translate msg="scripts.overview.list.sort.script_name" />,
        sortType: SortType.String,
    },
    version: {
        label: <Translate msg="scripts.overview.list.sort.version" />,
        sortType: SortType.DotSeparatedNumber,
    },
    lastRunDate: {
        label: <Translate msg="scripts.overview.list.sort.last_run_date" />,
        sortType: SortType.String,
    },
};

interface IComponentState {
    sortedColumn: ISortedColumn<IColumnNames>;
    filters: ListFilters<Partial<IColumnNames>>;
    idOfScriptToDelete: ReactText;
}

type TProps = WithStyles<typeof styles>;

const ScriptsOverview = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, IComponentState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);

            this.state = {
                sortedColumn: null,
                filters: getIntialFiltersFromFilterConfig(filterConfig),
                idOfScriptToDelete: null,
            };

            this.renderPanel = this.renderPanel.bind(this);
            this.renderContent = this.renderContent.bind(this);
            this.onSort = this.onSort.bind(this);
            this.onFilter = this.onFilter.bind(this);

            this.clearScriptToDelete = this.clearScriptToDelete.bind(this);
            this.setScriptToDelete = this.setScriptToDelete.bind(this);
        }

        public render() {
            const { classes } = this.props;
            const { sortedColumn, idOfScriptToDelete } = this.state;

            const scripts = getAsyncScripts(this.props.state).data;
            const listItems = scripts
                ? mapScriptsToListItems(this.props.state.entities.scripts.data)
                : [];

            return (
                <>
                    <Box height="100%" display="flex" flexDirection="column">
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
                        title={<Translate msg="scripts.overview.delete_script_dialog.title" />}
                        text={<Translate msg="scripts.overview.delete_script_dialog.text" />}
                        open={!!idOfScriptToDelete}
                        onClose={this.clearScriptToDelete}
                        onConfirm={this.clearScriptToDelete} // TODO: actually delete script
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
                scheduling: {
                    label: (
                        <Translate msg="scripts.overview.list.labels.scheduling" />
                    ),
                    className: classes.scriptSchedules,
                    fixedWidth: '9%',
                },
                lastRunDate: {
                    label: (
                        <Translate msg="scripts.overview.list.labels.last_run_date" />
                    ),
                    fixedWidth: '17%',
                    hideOnCompactView: true,
                    icon: <WatchLater />,
                },
                lastRunStatus: {
                    fixedWidth: '17%',
                    label: (
                        <Translate msg="scripts.overview.list.labels.last_run_status" />
                    ),
                    className: (value) => {
                        if (value === 'Passed') {
                            return classes.scriptSuccess;
                        }
                        return classes.scriptFailed;
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

            return (
                <>
                    <Box paddingBottom={5} marginX={2.8}>
                        <GenericList
                            listActions={[
                                {
                                    icon: <PlayArrowRounded />,
                                    label: <Translate msg="scripts.overview.list.actions.execute" />,
                                    // eslint-disable-next-line no-alert
                                    onClick: (id) => alert(`execute: ${id}`),
                                }, {
                                    icon: <Edit />,
                                    label: <Translate msg="scripts.overview.list.actions.edit" />,
                                    onClick: (id) => redirectTo({
                                        routeKey: ROUTE_KEYS.R_SCRIPT_DETAIL,
                                        params: { scriptId: id },
                                    }),
                                }, {
                                    icon: <ReportIcon />,
                                    label: <Translate msg="scripts.overview.list.actions.report" />,
                                    // eslint-disable-next-line no-alert
                                    onClick: (id) => alert(`report: ${id}`),
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
                    </Box>
                </>
            );
        }

        private onSort(sortedColumn: ISortedColumn<IColumnNames>) {
            this.setState({ sortedColumn });
        }

        private onFilter(listFilters: ListFilters<Partial<IColumnNames>>) {
            this.setState({ filters: listFilters });
        }

        private clearScriptToDelete() {
            this.setState({ idOfScriptToDelete: null });
        }

        private setScriptToDelete(id: ReactText) {
            this.setState({ idOfScriptToDelete: id });
        }
    },
);

function mapScriptsToListItems(scripts: IScriptBase[]): IListItem<IColumnNames>[] {
    return scripts.map((script, index) => ({
        id: script.name,
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
                                content: `${label.name} - ${label.value}`,
                            }))}
                        />
                    </Typography>
                ),
            },
            scheduling: { // TODO: fetch should return scheduling data
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        TODO:
                        <OrderedList
                            items={[
                                { content: 'Scheduling A' },
                                { content: 'Scheduling B' },
                            ]}
                        />
                    </Typography>
                ),
            },
            lastRunDate: { // TODO: fetch should return last run data
                value: '22-04-2020',
                sortValue: new Date('2020-04-22').toISOString(),
            },
            lastRunStatus: 'Passed',
        },
    }));
}

export default observe<TProps>([StateChangeNotification.DESIGN_SCRIPTS_LIST], ScriptsOverview);
