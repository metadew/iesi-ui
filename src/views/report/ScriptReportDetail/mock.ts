import { IScriptExecutionDetail } from 'models/state/scriptExecutions.models';
import { ILabel, IParameter } from 'models/state/iesiGeneric.models';

export const MOCKED_ACTIONS_LIST_ITEMS = [{
    id: 1232321,
    columns: {
        name: 'Set ID',
        description: 'ID to use for this script',
    },
    data: {
        error: 'An error occured because of multiple entries',
        parameters: [
            {
                description: 'Name of the parameter to set as runtime variable',
                values: ['old name', 'new name'],
                id: 1,
            },
            {
                description: 'Name of the parameter to set as runtime variable',
                values: ['old name', 'new name'],
                id: 2,
            },
        ],
        category: 'Parameters',
    },
}, {
    id: 2123123,
    columns: {
        name: 'Set duration',
        description: 'Set duration for the script to run',
    },
    data: {
        error: 'An error occured because of multiple entries',
        parameters: [
            {
                description: 'Name of the parameter to set as runtime variable',
                values: ['old name', 'new name'],
                id: 3,
            },
            {
                description: 'Name of the parameter to set as runtime variable',
                values: ['old name', 'new name'],
                id: 4,
            },
        ],
        category: 'Parameters',
    },
}, {
    id: 3123123,
    columns: {
        name: 'Set repeat',
        description: 'Set script repeat amount',
    },
    data: {
        error: 'An error occured because of multiple entries',
        parameters: [
            {
                description: 'Name of the parameter to set as runtime variable',
                values: ['old name', 'new name'],
                id: 5,
            },
            {
                description: 'Name of the parameter to set as runtime variable',
                values: ['old name', 'new name'],
                id: 6,
            },
        ],
        category: 'Parameters',
    },
}, {
    id: 4124124,
    columns: {
        name: 'Cleanup',
        description: 'Removes all rows with incomplete data',
    },
    data: {
        error: 'An error occured because of multiple entries',
        parameters: [
            {
                description: 'Name of the parameter to set as runtime variable',
                values: ['old name', 'new name'],
                id: 7,
            },
            {
                description: 'Name of the parameter to set as runtime variable',
                values: ['old name', 'new name'],
                id: 8,
            },
        ],
        category: 'Database',
    },
}, {
    id: 12123,
    columns: {
        name: 'Copy row',
        description: 'Copy data from one row to another',
    },
    data: {
        error: 'An error occured because of multiple entries',
        parameters: [
            {
                description: 'Name of the parameter to set as runtime variable',
                values: ['old name', 'new name'],
                id: 9,
            },
            {
                description: 'Name of the parameter to set as runtime variable',
                values: ['old name', 'new name'],
                id: 10,
            },
        ],
        category: 'Database',
    },
}, {
    id: 12123223,
    columns: {
        name: 'Delete row',
        description: 'Delete row from database',
    },
    data: {
        error: 'An error occured because of multiple entries',
        parameters: [
            {
                description: 'Name of the parameter to set as runtime variable',
                values: ['old name', 'new name'],
                id: 11,
            },
            {
                description: 'Name of the parameter to set as runtime variable',
                values: ['old name', 'new name'],
                id: 12,
            },
        ],
        category: 'Database',
    },
}];

export const MOCKED_SCRIPT_LABELS: ILabel[] = [
    {
        name: 'label-1',
        value: 'Label 1',
    }, {
        name: 'label-2',
        value: 'Label 2',
    },
];

export const MOCKED_SCRIPT_PARAMETERS: IParameter[] = [
    {
        name: 'param-1',
        value: 'value 1',
    }, {
        name: 'param-2',
        value: 'value2',
    },
];

export const MOCKED_SCRIPT_EXECUTION: IScriptExecutionDetail = {
    runId: '98ee8a1f-3760-420c-a953-ab829a0bcc9a',
    processId: -1,
    parentProcessId: -1,
    scriptId: '6873c540d7d6719e0d50ef633fe4b8b05b1f5dce942050ec67db27af28fe324a',
    scriptName: 'fwk.executeScript',
    scriptVersion: 0,
    environment: 'iesi-test',
    status: 'SUCCESS',
    startTimestamp: '2020-08-11T18:26:24.015',
    endTimestamp: '2020-08-11T18:26:28.179',
    inputParameters: [
        {
            name: 'test',
            value: '12',
        },
        {
            name: 'retest',
            value: '32',
        },
    ],
    designLabels: [
        {
            name: 'label1',
            value: 'value1',
        },
        {
            name: 'label2',
            value: 'value2',
        },
    ],
    executionLabels: [
        {
            name: 'label',
            value: 'bonjour',
        },
        {
            name: 'label2',
            value: 'hallo',
        },
    ],
    actions: [
        {
            runId: '98ee8a1f-3760-420c-a953-ab829a0bcc9a',
            processId: 0,
            type: 'fwk.setIteration',
            name: 'Action1',
            description: 'Define the iteration',
            condition: '',
            errorStop: false,
            errorExpected: false,
            status: 'SUCCESS',
            startTimestamp: '2020-08-11T18:26:24.358',
            endTimestamp: '2020-08-11T18:26:24.526',
            inputParameters: [
                {
                    name: 'name',
                    rawValue: 'Iteration1',
                    resolvedValue: 'Iteration1',
                },
                {
                    name: 'from',
                    rawValue: '1',
                    resolvedValue: '1',
                },
                {
                    name: 'to',
                    rawValue: '3',
                    resolvedValue: '3',
                },
                {
                    name: 'type',
                    rawValue: 'for',
                    resolvedValue: 'for',
                },
            ],
            output: [],
        },
        {
            runId: '98ee8a1f-3760-420c-a953-ab829a0bcc9a',
            processId: 7,
            type: 'fwk.executeScript',
            name: 'shell execution and wait',
            description: 'Execute latest version of script',
            condition: '',
            errorStop: false,
            errorExpected: false,
            status: 'SUCCESS',
            startTimestamp: '2020-08-11T18:26:27.119',
            endTimestamp: '2020-08-11T18:26:28.159',
            inputParameters: [
                {
                    name: 'version',
                    rawValue: '0',
                    resolvedValue: '0',
                },
                {
                    name: 'script',
                    rawValue: 'cli.executeCommand',
                    resolvedValue: 'cli.executeCommand',
                },
            ],
            output: [],
        },
        {
            runId: '98ee8a1f-3760-420c-a953-ab829a0bcc9a',
            processId: 4,
            type: 'fwk.executeScript',
            name: 'shell execution and wait',
            description: 'Execute latest version of script',
            condition: '',
            errorStop: false,
            errorExpected: false,
            status: 'SUCCESS',
            startTimestamp: '2020-08-11T18:26:26.009',
            endTimestamp: '2020-08-11T18:26:27.083',
            inputParameters: [
                {
                    name: 'version',
                    rawValue: '0',
                    resolvedValue: '0',
                },
                {
                    name: 'script',
                    rawValue: 'cli.executeCommand',
                    resolvedValue: 'cli.executeCommand',
                },
            ],
            output: [],
        },
        {
            runId: '98ee8a1f-3760-420c-a953-ab829a0bcc9a',
            processId: 1,
            type: 'fwk.executeScript',
            name: 'shell execution and wait',
            description: 'Execute latest version of script',
            condition: '',
            errorStop: false,
            errorExpected: false,
            status: 'SUCCESS',
            startTimestamp: '2020-08-11T18:26:24.598',
            endTimestamp: '2020-08-11T18:26:25.969',
            inputParameters: [
                {
                    name: 'version',
                    rawValue: '0',
                    resolvedValue: '0',
                },
                {
                    name: 'script',
                    rawValue: 'cli.executeCommand',
                    resolvedValue: 'cli.executeCommand',
                },
            ],
            output: [],
        },
    ],
    output: [],
};
