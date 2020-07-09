import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import DescriptionList from 'views/common/list/DescriptionList';
import { ROUTE_KEYS } from 'views/routes';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel/index';
import { observe, IObserveProps } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { getTranslator } from 'state/i18n/selectors';
import { ListColumns } from 'models/list.models';
import CollapsingList from './CollapsingList';
import ShowLabels from './ShowLabels';
import ShowParameters from './ShowParameters';
import { MOCKED_SCRIPT_LABELS, MOCKED_ACTIONS_LIST_ITEMS, MOCKED_SCRIPT_PARAMETERS } from './mock';

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
        '&:after': {
            display: 'none',
        },
    },
}));

function ExecutionDetail({ state }: IObserveProps) {
    const classes = useStyles();

    return (
        <ContentWithSidePanel
            panel={renderDetailPanel()}
            content={renderDetailContent()}
            goBackTo={ROUTE_KEYS.R_REPORTS}
            toggleLabel={<Translate msg="script_reports.detail.side.toggle_button" />}
        />
    );

    function renderDetailContent() {
        const listItems = MOCKED_ACTIONS_LIST_ITEMS;

        const columns: ListColumns<IColumnNames> = {
            name: {
                fixedWidth: '40%',
                className: classes.scriptName,
            },
            description: {
                fixedWidth: '50%',
                className: classes.scriptDescription,
            },
        };

        return (
            <Box marginY={1}>
                <CollapsingList
                    listItems={listItems}
                    columns={columns}
                />
            </Box>
        );
    }

    function renderDetailPanel() {
        const translator = getTranslator(state);

        return (
            <Box mt={1} display="flex" flexDirection="column" flex="1 1 auto">
                <Box>
                    <DescriptionList
                        items={[
                            {
                                label: translator('script_reports.detail.side.description.version'),
                                value: '01',
                            },
                            {
                                label: translator('script_reports.detail.side.description.request_timestamp'),
                                value: '10-10-2018',
                            },
                            {
                                label: translator('script_reports.detail.side.description.execution_status'),
                                value: 'Passed',
                            },
                        ]}
                    />
                    <DescriptionList
                        noLineAfterListItem
                        items={[
                            {
                                label: <Translate msg="script_reports.detail.side.labels.title" />,
                                value: <ShowLabels labels={MOCKED_SCRIPT_LABELS} />,
                            },
                            {
                                label: <Translate msg="script_reports.detail.side.parameters.title" />,
                                value: <ShowParameters parameters={MOCKED_SCRIPT_PARAMETERS} />,
                            },
                        ]}
                    />
                </Box>
            </Box>
        );
    }
}

export default observe([
    StateChangeNotification.I18N_TRANSLATIONS,
], ExecutionDetail);
