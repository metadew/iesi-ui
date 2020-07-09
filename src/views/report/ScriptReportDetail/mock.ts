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
