import React from 'react';
import isEmptyObject from '@snipsonian/core/es/object/isEmptyObject';
import { Box, makeStyles } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import DescriptionList, { IDescriptionListItem } from 'views/common/list/DescriptionList';
import { ROUTE_KEYS } from 'views/routes';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel/index';
import { getAsyncExecutionRequestDetail } from 'state/entities/executionRequests/selectors';
import { observe, IObserveProps } from 'views/observe';
import Loader from 'views/common/waiting/Loader';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { StateChangeNotification } from 'models/state.models';
import { getTranslator } from 'state/i18n/selectors';
import { IExecutionRequest } from 'models/state/executionRequests.models';
import { IScriptExecutionDetailAction } from 'models/state/scriptExecutions.models';
import { triggerFetchScriptExecutionDetail } from 'state/entities/scriptExecutions/triggers';
import { getAsyncScriptExecutionDetail } from 'state/entities/scriptExecutions/selectors';
import { ListColumns, IListItem } from 'models/list.models';
// import {
//     isExecutionRequestStatusNewOrSubmitted,
//     isExecutionRequestStatusAbortedOrDeclined,
// } from 'utils/scripts/executionRequests';
import ScriptExecutionDetailActions from './ScriptExecutionDetailActions';
import ShowLabels from './ShowLabels';
import { MOCKED_SCRIPT_EXECUTION } from './mock';


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

    // const scriptExecutionData = getAsyncScriptExecutionDetail(state).data;
    const scriptExecutionData = MOCKED_SCRIPT_EXECUTION;
    const scriptExecutionAsyncStatus = getAsyncScriptExecutionDetail(state).fetch.status;

    const isExecutionRequestDataAvailable = !isEmptyObject(executionRequestDetail);
    // && !isExecutionRequestStatusNewOrSubmitted(executionRequestDetail.executionRequestStatus)
    // && !isExecutionRequestStatusAbortedOrDeclined(executionRequestDetail.executionRequestStatus);

    if (isExecutionRequestDataAvailable) {
        triggerFetchScriptExecutionDetail({
            runId: '98ee8a1f-3760-420c-a953-ab829a0bcc9a', // TODO: runId?
            processId: -1,
        });
    }

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
        /*
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
        */

        // triggerFetchScriptExecutionDetail({
        //     runId: '98ee8a1f-3760-420c-a953-ab829a0bcc9a',
        //     processId: -1,
        // });
        // const scriptExecutionData = getAsyncScriptExecutionDetail(state).data;
        // const scriptExecutionAsyncStatus = getAsyncScriptExecutionDetail(state).fetch.status;

        const listItems = mapActionsToListItems(scriptExecutionData.actions);
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
                <ScriptExecutionDetailActions
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

        const descriptionListItems: IDescriptionListItem[] = [
            {
                label: translator('script_reports.detail.side.description.name'),
                value: executionRequestDetail.scriptExecutionRequests
                    && executionRequestDetail.name,
            },
            {
                label: translator('script_reports.detail.side.description.description'),
                value: executionRequestDetail.scriptExecutionRequests
                    && executionRequestDetail.description,
            },
            {
                label: translator('script_reports.detail.side.description.execution_status'),
                value: executionRequestDetail.executionRequestStatus,
            },
        ];

        if (isExecutionRequestDataAvailable && scriptExecutionAsyncStatus === AsyncStatus.Success) {
            descriptionListItems.push(
                {
                    label: translator('script_reports.detail.side.description.version'),
                    value: scriptExecutionData && scriptExecutionData.scriptVersion,
                },
                {
                    label: translator('script_reports.detail.side.description.start_timestamp'),
                    value: scriptExecutionData && scriptExecutionData.startTimestamp,
                },
                {
                    label: translator('script_reports.detail.side.description.end_timestamp'),
                    value: scriptExecutionData && scriptExecutionData.endTimestamp,
                },
            );
        }

        return (
            <Box mt={1} display="flex" flexDirection="column" flex="1 1 auto">
                <Box>
                    <DescriptionList
                        items={descriptionListItems}
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

    function mapActionsToListItems(items: IScriptExecutionDetailAction[]) {
        return items.map((item) => {
            const listItem: IListItem<IColumnNames> = {
                id: `${item.runId}-${item.processId}`,
                columns: {
                    name: item.name,
                    description: item.description,
                },
                data: {
                    processId: item.processId,
                    error: null,
                    inputParameters: item.inputParameters,
                },
            };
            return listItem;
        });
    }
}

export default observe([
    StateChangeNotification.EXECUTION_REQUESTS_DETAIL,
    StateChangeNotification.I18N_TRANSLATIONS,
], ExecutionDetail);
