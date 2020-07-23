import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import DescriptionList from 'views/common/list/DescriptionList';
import { ROUTE_KEYS } from 'views/routes';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel/index';
import { getAsyncExecutionRequestDetail } from 'state/entities/executionRequests/selectors';
import { observe, IObserveProps } from 'views/observe';
import Loader from 'views/common/waiting/Loader';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { StateChangeNotification } from 'models/state.models';
import { getTranslator } from 'state/i18n/selectors';
import { IExecutionRequest } from 'models/state/executionRequests.models';
import { ListColumns } from 'models/list.models';
import {
    isExecutionRequestStatusNewOrSubmitted,
    isExecutionRequestStatusAbortedOrDeclined,
} from 'utils/scripts/executionRequests';
import CollapsingList from './CollapsingList';
import ShowLabels from './ShowLabels';
import { MOCKED_ACTIONS_LIST_ITEMS } from './mock';


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

    const asyncExecutionRequest = getAsyncExecutionRequestDetail(state).fetch;
    const executionRequestDetail = getAsyncExecutionRequestDetail(state).data || {} as IExecutionRequest;

    return (
        <>
            <Loader show={asyncExecutionRequest.status === AsyncStatus.Busy} />
            <ContentWithSidePanel
                panel={renderDetailPanel()}
                content={renderDetailContent()}
                goBackTo={ROUTE_KEYS.R_REPORTS}
                toggleLabel={<Translate msg="script_reports.detail.side.toggle_button" />}
            />
        </>
    );

    function renderDetailContent() {
        if (asyncExecutionRequest.error) {
            return (
                <div>
                    <Alert severity="error">
                        <AlertTitle><Translate msg="script_reports.detail.main.error.title" /></AlertTitle>
                        <Translate msg="script_reports.detail.main.error.text" />
                    </Alert>
                </div>
            );
        }
        if (isExecutionRequestStatusNewOrSubmitted(executionRequestDetail.executionRequestStatus)) {
            return (
                <div>
                    <Alert severity="info">
                        <AlertTitle><Translate msg="script_reports.detail.main.execution_pending.title" /></AlertTitle>
                        <Translate msg="script_reports.detail.main.execution_pending.text" />
                    </Alert>
                </div>
            );
        }
        if (isExecutionRequestStatusAbortedOrDeclined(executionRequestDetail.executionRequestStatus)) {
            return (
                <div>
                    <Alert severity="info">
                        <AlertTitle><Translate msg="script_reports.detail.main.execution_failed.title" /></AlertTitle>
                        <Translate msg="script_reports.detail.main.execution_failed.text" />
                    </Alert>
                </div>
            );
        }

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

        if (asyncExecutionRequest.error) {
            return null;
        }

        return (
            <Box mt={1} display="flex" flexDirection="column" flex="1 1 auto">
                <Box>
                    <DescriptionList
                        items={[
                            {
                                label: translator('script_reports.detail.side.description.version'),
                                value: 'todo?',
                            },
                            {
                                label: translator('script_reports.detail.side.description.request_timestamp'),
                                value: executionRequestDetail.requestTimestamp,
                            },
                            {
                                label: translator('script_reports.detail.side.description.execution_status'),
                                value: executionRequestDetail.executionRequestStatus,
                            },
                        ]}
                    />
                    <DescriptionList
                        noLineAfterListItem
                        items={[
                            {
                                label: <Translate msg="script_reports.detail.side.labels.title" />,
                                value: <ShowLabels labels={executionRequestDetail.executionRequestLabels || []} />,
                            },
                            // {
                            //     label: <Translate msg="script_reports.detail.side.parameters.title" />,
                            //     value: <ShowParameters parameters={MOCKED_SCRIPT_PARAMETERS} />,
                            // },
                        ]}
                    />
                </Box>
            </Box>
        );
    }
}

export default observe([
    StateChangeNotification.EXECUTION_REQUESTS_DETAIL,
    StateChangeNotification.I18N_TRANSLATIONS,
], ExecutionDetail);
