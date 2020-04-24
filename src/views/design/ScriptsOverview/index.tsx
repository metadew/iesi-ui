import React, { useState } from 'react';
import {
    Typography,
    Box,
    Theme,
    makeStyles,
} from '@material-ui/core';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import AppTemplateContainer from 'views/appShell/AppTemplateContainer';
import GenericList from 'views/common/list/GenericList';
import GenericSort from 'views/common/list/GenericSort';
import { grey } from '@material-ui/core/colors';
import { Delete, Cloud } from '@material-ui/icons';
import { ListColumns, ISortedColumn, SortActions, SortType } from 'models/list.models';

const useStyles = makeStyles(({ palette }: Theme) => ({
    header: {
        backgroundColor: grey[50],
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
}));

interface IColumnNames {
    name: string;
    version: string;
    description: string;
    lastRunDate: string;
    lastRunStatus: string;
}

function ScriptsOverview() {
    const [sortedColumn, setSortedColumn] = useState<ISortedColumn<IColumnNames>>(null);
    const classes = useStyles();

    const columns: ListColumns<IColumnNames> = {
        name: {
            className: classes.scriptName,
        },
        version: {
            className: classes.scriptVersion,
        },
        description: {
            className: classes.scriptDescription,
        },
        lastRunDate: {
            label: <Translate msg="scripts.overview.list.labels.last_run_date" />,
        },
        lastRunStatus: {
            label: <Translate msg="scripts.overview.list.labels.last_run_status" />,
            className: (value) => {
                if (value === 'Passed') {
                    return classes.scriptSuccess;
                }
                return classes.scriptFailed;
            },
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

    return (
        <div>
            <Box paddingTop={3} paddingBottom={3} className={classes.header}>
                <AppTemplateContainer>
                    <Typography variant="h6">You have 50 scripts</Typography>
                    <GenericSort
                        sortActions={sortActions}
                        setSortedColumn={setSortedColumn}
                        sortedColumn={sortedColumn as ISortedColumn<{}>}
                    />
                </AppTemplateContainer>
            </Box>
            <AppTemplateContainer>
                <Box marginTop={3}>
                    <GenericList
                        listActions={[{
                            icon: <Cloud />,
                            onClick: (id) => console.log(id),
                        }, {
                            icon: <Delete />,
                            onClick: (id) => console.log(id),
                        }]}
                        columns={columns}
                        sortedColumn={sortedColumn}
                        listItems={[{
                            id: 1,
                            columns: {
                                name: 'Script One',
                                version: '0.8.2',
                                description: 'lorem ipsum',
                                lastRunDate: {
                                    value: '22 april 2020',
                                    sortValue: '2020-04-22',
                                },
                                lastRunStatus: 'Passed',
                            },
                        }, {
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
                        }, {
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
                        }]}
                    />
                </Box>
            </AppTemplateContainer>
        </div>
    );
}

export default ScriptsOverview;
