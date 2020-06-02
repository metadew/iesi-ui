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
import { Edit, Delete, PlayArrowRounded, InsertChart } from '@material-ui/icons';
import {
    ListColumns,
    ISortedColumn,
    SortActions,
    SortType,
    FilterType,
    ListFilters,
    FilterConfig,
} from 'models/list.models';
import ContentWithSlideoutPanel from 'views/common/layout/ContentWithSlideoutPanel';
import GenericFilter from 'views/common/list/GenericFilter';
import { getIntialFiltersFromFilterConfig } from 'utils/list/filters';
import { redirectTo, ROUTE_KEYS } from 'views/routes';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
import { MOCKED_LIST_ITEMS } from './mock';

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
        scriptSuccess: {
            fontWeight: typography.fontWeightBold,
            color: palette.success.main,
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
    lastRunDate: string;
    lastRunStatus: string;
}

const filterConfig: FilterConfig<Partial<IColumnNames>> = {
    lastRunDate: {
        label: <Translate msg="scripts.overview.list.filter.last_run_date" />,
        filterType: FilterType.Select,
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
    class extends React.Component<TProps, IComponentState> {
        private mockedListItems = MOCKED_LIST_ITEMS;

        public constructor(props: TProps) {
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
                                        placeholders={{ amount: this.mockedListItems.length }}
                                    />
                                </Typography>
                                <GenericSort
                                    sortActions={sortActions}
                                    onSort={this.onSort}
                                    sortedColumn={sortedColumn as ISortedColumn<{}>}
                                />
                            </AppTemplateContainer>
                        </Box>
                        <ContentWithSlideoutPanel
                            toggleLabel={
                                <Translate msg="common.list.filter.toggle" />
                            }
                            panel={this.renderPanel()}
                            content={this.renderContent()}
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

        private renderPanel() {
            return (
                <GenericFilter
                    filterConfig={filterConfig}
                    onFilterChange={this.onFilter}
                    listItems={this.mockedListItems}
                />
            );
        }

        private renderContent() {
            const { classes } = this.props;
            const { sortedColumn, filters } = this.state;
            const columns: ListColumns<IColumnNames> = {
                name: {
                    className: classes.scriptName,
                    fixedWidth: '20%',
                },
                version: {
                    className: classes.scriptVersion,
                    fixedWidth: '13%',
                },
                description: {
                    className: classes.scriptDescription,
                    tooltip: (value) => value,
                    fixedWidth: '30%',
                },
                lastRunDate: {
                    label: (
                        <Translate msg="scripts.overview.list.labels.last_run_date" />
                    ),
                    fixedWidth: '17%',
                },
                lastRunStatus: {
                    fixedWidth: '20%',
                    label: (
                        <Translate msg="scripts.overview.list.labels.last_run_status" />
                    ),
                    className: (value) => {
                        if (value === 'Passed') {
                            return classes.scriptSuccess;
                        }
                        return classes.scriptFailed;
                    },
                },
            };

            return (
                <>
                    <Box marginBottom={3} marginX={2.8}>
                        <GenericList
                            listActions={[
                                {
                                    icon: <PlayArrowRounded />,
                                    // eslint-disable-next-line no-alert
                                    onClick: (id) => alert(`execute: ${id}`),
                                }, {
                                    icon: <Edit />,
                                    onClick: (id) => redirectTo({
                                        routeKey: ROUTE_KEYS.R_SCRIPT_DETAIL,
                                        params: { scriptId: id },
                                    }),
                                }, {
                                    icon: <InsertChart />,
                                    // eslint-disable-next-line no-alert
                                    onClick: (id) => alert(`report: ${id}`),
                                }, {
                                    icon: <Delete />,
                                    onClick: this.setScriptToDelete,
                                },
                            ]}
                            columns={columns}
                            sortedColumn={sortedColumn}
                            filters={filters}
                            listItems={this.mockedListItems}
                            enablePagination
                        />
                    </Box>
                    {/* TODO: Add Loader when really fetching data */}
                    {/* <Loader showImmediately show /> */}
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

export default ScriptsOverview;
