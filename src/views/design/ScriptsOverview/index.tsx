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
import { Edit } from '@material-ui/icons';
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

const styles = ({ palette }: Theme) =>
    createStyles({
        header: {
            backgroundColor: palette.background.paper,
            borderBottom: '1px solid',
            borderBottomColor: palette.grey[200],
        },
        scriptName: {
            fontWeight: 700,
            color: palette.primary.main,
        },
        scriptVersion: {
            fontWeight: 700,
            color: palette.primary.dark,
        },
        scriptDescription: {
            fontWeight: 700,
            color: palette.primary.dark,
        },
        scriptSuccess: {
            fontWeight: 700,
            color: palette.success.main,
        },
        scriptFailed: {
            fontWeight: 700,
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
}

type TProps = WithStyles<typeof styles>;

const ScriptsOverview = withStyles(styles)(
    class extends React.Component<TProps, IComponentState> {
        private mockedListItems = [
            {
                id: 1,
                columns: {
                    name: 'Script One',
                    version: '0.8.2',
                    description: 'lorem ipsum aoihaf oiad ijdizj. azodh izi haf oiad ijdizj. azo azazdoijazd iizaidi',
                    lastRunDate: {
                        value: '22 april 2020',
                        sortValue: '2020-04-22',
                    },
                    lastRunStatus: 'Passed',
                },
            },
            {
                id: 2,
                columns: {
                    name: 'Script Two',
                    version: '1.0',
                    description: 'lorem ipsum',
                    lastRunDate: {
                        value: '21 april 2020',
                        sortValue: '2020-04-21',
                    },
                    lastRunStatus: 'Failed',
                },
            },
            {
                id: 3,
                columns: {
                    name: 'Script Three',
                    version: '2.0.1',
                    description: 'lorem ipsum',
                    lastRunDate: {
                        value: '18 april 2020',
                        sortValue: '2020-04-18',
                    },
                    lastRunStatus: 'Passed',
                },
            },
            {
                id: 4,
                columns: {
                    name: 'Script Four',
                    version: '0.8.2',
                    description: 'lorem ipsum aoihaf oiad ijdizj. azodh izi haf oiad ijdizj. azo azazdoijazd iizaidi',
                    lastRunDate: {
                        value: '22 april 2020',
                        sortValue: '2020-04-22',
                    },
                    lastRunStatus: 'Passed',
                },
            },
            {
                id: 5,
                columns: {
                    name: 'Script Five',
                    version: '5.0',
                    description: 'lorem ipsum',
                    lastRunDate: {
                        value: '23 februari 2020',
                        sortValue: '2020-02-23',
                    },
                    lastRunStatus: 'Failed',
                },
            },
            {
                id: 6,
                columns: {
                    name: 'Script Six',
                    version: '2.0.1',
                    description: 'lorem ipsum',
                    lastRunDate: {
                        value: '18 april 2020',
                        sortValue: '2020-04-18',
                    },
                    lastRunStatus: 'Failed',
                },
            },
        ];

        public constructor(props: TProps) {
            super(props);

            this.state = {
                sortedColumn: null,
                filters: getIntialFiltersFromFilterConfig(filterConfig),
            };

            this.renderPanel = this.renderPanel.bind(this);
            this.renderContent = this.renderContent.bind(this);
            this.onSort = this.onSort.bind(this);
            this.onFilter = this.onFilter.bind(this);
        }

        public render() {
            const { classes } = this.props;
            const { sortedColumn } = this.state;

            return (
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
                },
                version: {
                    className: classes.scriptVersion,
                },
                description: {
                    className: classes.scriptDescription,
                    tooltip: (value) => value,
                    fixedWidth: '20%',
                },
                lastRunDate: {
                    label: (
                        <Translate msg="scripts.overview.list.labels.last_run_date" />
                    ),
                },
                lastRunStatus: {
                    label: (
                        <Translate msg="scripts.overview.list.labels.last_run_status" />
                    ),
                    className: (value) => {
                        if (value === 'Passed') {
                            return classes.scriptSuccess;
                        }
                        return classes.scriptFailed;
                    },
                    tooltip: (value) => value,
                },
            };

            return (
                <Box marginTop={3}>
                    <GenericList
                        listActions={[
                            {
                                icon: <Edit />,
                                onClick: (id) => redirectTo({
                                    routeKey: ROUTE_KEYS.R_SCRIPT_DETAIL,
                                    params: { scriptId: id },
                                }),
                            },
                        ]}
                        columns={columns}
                        sortedColumn={sortedColumn}
                        filters={filters}
                        listItems={this.mockedListItems}
                        enablePagination
                    />
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

export default ScriptsOverview;
