import { IEnvironment } from 'models/state/environments.models';
import { IScriptSchedule } from 'models/state/scripts.models';
import { ILabel } from 'models/state/iesiGeneric.models';

export const MOCKED_ACTIONS_LIST_ITEMS = [{
    id: 1232321,
    columns: {
        name: 'Set ID',
        description: 'ID to use for this script',
    },
    data: {
        category: 'Parameters',
    },
}, {
    id: 2123123,
    columns: {
        name: 'Set duration',
        description: 'Set duration for the script to run',
    },
    data: {
        category: 'Parameters',
    },
}, {
    id: 3123123,
    columns: {
        name: 'Set repeat',
        description: 'Set script repeat amount',
    },
    data: {
        category: 'Parameters',
    },
}, {
    id: 4124124,
    columns: {
        name: 'Cleanup',
        description: 'Removes all rows with incomplete data',
    },
    data: {
        category: 'Database',
    },
}, {
    id: 12123,
    columns: {
        name: 'Copy row',
        description: 'Copy data from one row to another',
    },
    data: {
        category: 'Database',
    },
}, {
    id: 12123223,
    columns: {
        name: 'Delete row',
        description: 'Delete row from database',
    },
    data: {
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

export const MOCKED_SCRIPT_SCHEDULES: IScriptSchedule[] = [
    {
        environment: 'staging',
        frequency: 10,
    },
    {
        environment: 'production',
        frequency: 60,
    },
];

export const MOCKED_ENVS: IEnvironment[] = [
    {
        name: 'staging',
        description: 'staging description',
    },
    {
        name: 'production',
        description: 'prod description',
    },
];
