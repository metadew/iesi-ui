import React, { useState } from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';
import { ExpandMore as ExpandIcon } from '@material-ui/icons';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import DescriptionList from 'views/common/list/DescriptionList';
import { ROUTE_KEYS } from 'views/routes';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel/index';
import { ListColumns } from 'models/list.models';
import GenericCollapsingList from 'views/common/list/GenericCollapsingList';
import ShowLabels from './labels';
import ShowSchedules from './schedules';
import { MOCKED_SCRIPT_LABELS, MOCKED_SCRIPT_SCHEDULES, MOCKED_ACTIONS_LIST_ITEMS } from './mock';

interface IColumnNames {
    name: string;
    description: string;
}

const useStyles = makeStyles(({ palette, typography }) => ({
    scriptName: {
        fontWeight: typography.fontWeightBold,
        color: palette.primary.main,
    },
    scriptDescription: {
        fontWeight: typography.fontWeightBold,
        position: 'relative',
    },
}));

export default function ScriptDetail() {
    const [listItems] = useState(MOCKED_ACTIONS_LIST_ITEMS);
    const classes = useStyles();

    const columns: ListColumns<IColumnNames> = {
        name: {
            fixedWidth: '20%',
            className: classes.scriptName,
        },
        description: {
            fixedWidth: '70%',
            className: classes.scriptDescription,
        },
    };

    const ScriptDetailPanel = () => (
        <Box mt={1} display="flex" flexDirection="column" flex="1 1 auto">
            <Box>
                <DescriptionList
                    items={[
                        { label: 'Version', value: '01' },
                        { label: 'Last run date', value: '10-10-2018' },
                        { label: 'Last run status', value: 'Passed' },
                    ]}
                />
                <DescriptionList
                    noLineAfterListItem
                    items={[
                        {
                            label: <Translate msg="scripts.detail.side.labels.title" />,
                            value: <ShowLabels labels={MOCKED_SCRIPT_LABELS} />,
                        },
                        {
                            label: <Translate msg="scripts.detail.side.schedules.title" />,
                            value: <ShowSchedules schedules={MOCKED_SCRIPT_SCHEDULES} />,
                        },
                    ]}
                />
            </Box>
        </Box>
    );

    const ScriptDetailContent = () => {
        const hasActions = listItems.length > 0;

        if (!hasActions) {
            return (
                <Box
                    display="flex"
                    flexDirection="column"
                    flex="1 1 auto"
                    justifyContent="center"
                    paddingBottom={5}
                >
                    <Box textAlign="center">
                        <Typography variant="h2" paragraph>
                            <Translate msg="scripts.detail.main.no_actions.title" />
                        </Typography>
                    </Box>
                </Box>
            );
        }

        return (
            <>
                <Box marginY={1}>
                    <GenericCollapsingList
                        listItems={listItems}
                        columns={columns}
                        listActions={[
                            {
                                icon: <ExpandIcon />,
                                label: <Translate msg="script_reports.detail.main.list.item.actions.expand" />,
                                onClick: (id, index) => {
                                    console.log(id, index);
                                },
                            },
                        ]}
                    />
                </Box>
            </>
        );
    };

    return (
        <>
            <ContentWithSidePanel
                panel={<ScriptDetailPanel />}
                content={<ScriptDetailContent />}
                goBackTo={ROUTE_KEYS.R_REPORTS}
                toggleLabel={<Translate msg="scripts.detail.side.toggle_button" />}
            />
        </>
    );
}
