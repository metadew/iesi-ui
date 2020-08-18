import React, { useEffect } from 'react';
import { parseISO, format as formatDate } from 'date-fns/esm';
import isEmptyObject from '@snipsonian/core/es/object/isEmptyObject';
import isSet from '@snipsonian/core/es/is/isSet';
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
import { ListColumns, IListItem, ISortedColumn, SortOrder, SortType } from 'models/list.models';
import sortListItems from 'utils/list/sortListItems';
import {
    isExecutionRequestStatusNewOrSubmitted,
    isExecutionRequestStatusAbortedOrDeclined,
} from 'utils/scripts/executionRequests';
import ScriptExecutionDetailActions from './ScriptExecutionDetailActions';
import ShowLabels from './ShowLabels';

interface IColumnNames {
    processId: number;
    name: string;
    description: string;
}

const useStyles = makeStyles(({ palette, typography }) => ({
    processId: {
        display: 'none',
    },
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

    const scriptExecutionData = getAsyncScriptExecutionDetail(state).data;

    const isExecutionRequestDataAvailable = !isEmptyObject(executionRequestDetail)
        && !isExecutionRequestStatusNewOrSubmitted(executionRequestDetail.executionRequestStatus)
        && !isExecutionRequestStatusAbortedOrDeclined(executionRequestDetail.executionRequestStatus)
        && executionRequestDetail.scriptExecutionRequests.length > 0
        && executionRequestDetail.scriptExecutionRequests[0].runId;

    useEffect(() => {
        if (isExecutionRequestDataAvailable) {
            const currentRunId = executionRequestDetail.scriptExecutionRequests[0].runId;
            if (!isSet(scriptExecutionData) || scriptExecutionData.runId !== currentRunId) {
                triggerFetchScriptExecutionDetail({
                    runId: executionRequestDetail.scriptExecutionRequests[0].runId,
                    processId: -1,
                });
            }
        }
        return () => {};
    }, [isExecutionRequestDataAvailable, executionRequestDetail, scriptExecutionData]);

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

        if (
            isExecutionRequestDataAvailable && scriptExecutionData
            && scriptExecutionData.runId === executionRequestDetail.scriptExecutionRequests[0].runId
        ) {
            const listItems = mapActionsToListItemsAndSortByProcessId(scriptExecutionData.actions);
            const columns: ListColumns<IColumnNames> = {
                processId: {
                    className: classes.processId,
                },
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

        return isExecutionRequestDataAvailable ? <Loader show /> : null;
    }

    function renderDetailPanel() {
        const translator = getTranslator(state);
        const scriptExecutionListItems: IDescriptionListItem[] = [];

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

        if (isExecutionRequestDataAvailable && scriptExecutionData) {
            scriptExecutionListItems.push(
                {
                    label: translator('script_reports.detail.side.description.script_name'),
                    value: scriptExecutionData && scriptExecutionData.scriptName,
                },
                {
                    label: translator('script_reports.detail.side.description.script_version'),
                    value: scriptExecutionData && scriptExecutionData.scriptVersion,
                },
                {
                    label: translator('script_reports.detail.side.description.start_timestamp'),
                    value: scriptExecutionData && formatDate(
                        parseISO(scriptExecutionData.startTimestamp.toString()),
                        'dd/MM/yyyy HH:mm:ss',
                    ),
                },
                {
                    label: translator('script_reports.detail.side.description.end_timestamp'),
                    value: scriptExecutionData && formatDate(
                        parseISO(scriptExecutionData.endTimestamp.toString()),
                        'dd/MM/yyyy HH:mm:ss',
                    ),
                },
            );
        }

        return (
            <Box mt={1} display="flex" flexDirection="column" flex="1 1 auto">
                <Box flex="1 1 auto">
                    <DescriptionList
                        items={descriptionListItems}
                    />
                    {(isExecutionRequestDataAvailable && scriptExecutionData) && (
                        <DescriptionList
                            noLineAfterListItem
                            items={[
                                {
                                    label: <Translate msg="script_reports.detail.side.input_parameters.title" />,
                                    value: scriptExecutionData.inputParameters.length
                                        ? <ShowLabels labels={scriptExecutionData.inputParameters} />
                                        : <Translate msg="script_reports.detail.side.input_parameters.none" />,
                                },
                            ]}
                        />
                    )}
                </Box>
                <Box>
                    <DescriptionList
                        noLineAfterListItem
                        items={scriptExecutionListItems}
                    />
                </Box>
            </Box>
        );
    }

    function mapActionsToListItemsAndSortByProcessId(items: IScriptExecutionDetailAction[]) {
        const listItems = items.map((item) => {
            const listItem: IListItem<IColumnNames> = {
                id: `${item.runId}-${item.processId}`,
                columns: {
                    processId: item.processId,
                    name: item.name,
                    description: item.description,
                },
                data: {
                    processId: item.processId,
                    error: 'error',
                    inputParameters: item.inputParameters,
                    type: item.type,
                    startTimestamp: item.startTimestamp,
                    endTimestamp: item.endTimestamp,
                    errorExpected: item.errorExpected,
                    errorStop: item.errorStop,
                    condition: item.condition,
                    output: item.output,
                },
            };
            return listItem;
        });

        return sortListItems(listItems, {
            name: 'processId',
            sortOrder: SortOrder.Ascending,
            sortType: SortType.Number,
        } as ISortedColumn<{}>);
    }
}

export default observe([
    StateChangeNotification.EXECUTION_REQUESTS_DETAIL,
    StateChangeNotification.EXECUTION_REQUESTS_DETAIL,
    StateChangeNotification.SCRIPT_EXECUTION_DETAIL,
    StateChangeNotification.I18N_TRANSLATIONS,
], ExecutionDetail);
