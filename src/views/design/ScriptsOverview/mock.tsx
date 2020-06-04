import React from 'react';
import OrderedList from 'views/common/list/OrderedList';
import { Typography } from '@material-ui/core';

export const MOCKED_LIST_ITEMS = [
    {
        id: 1,
        columns: {
            name: 'Convert data',
            version: '0.8.2',
            description: 'Converts the data in the database',
            lastRunDate: {
                value: '22-04-2020',
                sortValue: new Date('2020-04-22').toISOString(),
            },
            lastRunStatus: 'Passed',
            scheduling: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Production every day' },
                                { content: 'Staging every week' },
                            ]}
                        />
                    </Typography>
                ),
            },
            labels: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Label A' },
                                { content: 'Label B' },
                            ]}
                        />
                    </Typography>
                ),
            },
        },
    },
    {
        id: 2,
        columns: {
            name: 'Copy database',
            version: '1.0',
            description: 'Creates a copy of the selected database',
            lastRunDate: {
                value: '21-04-2020',
                sortValue: new Date('2020-04-21').toISOString(),
            },
            lastRunStatus: 'Failed',
            scheduling: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Production every day' },
                                { content: 'Staging every week' },
                            ]}
                        />
                    </Typography>
                ),
            },
            labels: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Label A' },
                                { content: 'Label B' },
                            ]}
                        />
                    </Typography>
                ),
            },
        },
    },
    {
        id: 3,
        columns: {
            name: 'Replay video',
            version: '2.0.1',
            description: 'Find and replay video by URL',
            lastRunDate: {
                value: '18-04-2020',
                sortValue: new Date('2020-04-18').toISOString(),
            },
            lastRunStatus: 'Passed',
            scheduling: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Production every day' },
                                { content: 'Staging every week' },
                            ]}
                        />
                    </Typography>
                ),
            },
            labels: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Label A' },
                                { content: 'Label B' },
                            ]}
                        />
                    </Typography>
                ),
            },
        },
    },
    {
        id: 4,
        columns: {
            name: 'Upload all',
            version: '0.8.2',
            description: 'Uploads all files from the selected folder',
            lastRunDate: {
                value: '22-04-2020',
                sortValue: new Date('2020-04-22').toISOString(),
            },
            lastRunStatus: 'Passed',
            scheduling: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Production every day' },
                                { content: 'Staging every week' },
                            ]}
                        />
                    </Typography>
                ),
            },
            labels: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Label A' },
                                { content: 'Label B' },
                            ]}
                        />
                    </Typography>
                ),
            },
        },
    },
    {
        id: 5,
        columns: {
            name: 'Move files',
            version: '5.0',
            description: 'Moves all files from one destination to another',
            lastRunDate: {
                value: '23-02-2020',
                sortValue: new Date('2020-02-23').toISOString(),
            },
            lastRunStatus: 'Failed',
            scheduling: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Production every day' },
                                { content: 'Staging every week' },
                            ]}
                        />
                    </Typography>
                ),
            },
            labels: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Label A' },
                                { content: 'Label B' },
                            ]}
                        />
                    </Typography>
                ),
            },
        },
    },
    {
        id: 6,
        columns: {
            name: 'Convert video MP4',
            version: '2.0.1',
            description: 'Converts video file to MP4 format',
            lastRunDate: {
                value: '18-04-2020',
                sortValue: new Date('2020-04-18').toISOString(),
            },
            lastRunStatus: 'Failed',
            scheduling: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Production every day' },
                                { content: 'Staging every week' },
                            ]}
                        />
                    </Typography>
                ),
            },
            labels: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Label A' },
                                { content: 'Label B' },
                            ]}
                        />
                    </Typography>
                ),
            },
        },
    },
    {
        id: 7,
        columns: {
            name: 'Convert audio MP3',
            version: '2.0.1',
            description: 'Converts audio file to MP3 format',
            lastRunDate: {
                value: '18-04-2020',
                sortValue: new Date('2020-04-18').toISOString(),
            },
            lastRunStatus: 'Failed',
            scheduling: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Production every day' },
                                { content: 'Staging every week' },
                            ]}
                        />
                    </Typography>
                ),
            },
            labels: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Label A' },
                                { content: 'Label B' },
                            ]}
                        />
                    </Typography>
                ),
            },
        },
    },
    {
        id: 8,
        columns: {
            name: 'Convert audio WAV',
            version: '2.0.8',
            description: 'Converts audio file to WAV format',
            lastRunDate: {
                value: '18-05-2020',
                sortValue: new Date('2020-05-18').toISOString(),
            },
            lastRunStatus: 'Passed',
            scheduling: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Production every day' },
                                { content: 'Staging every week' },
                            ]}
                        />
                    </Typography>
                ),
            },
            labels: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Label A' },
                                { content: 'Label B' },
                            ]}
                        />
                    </Typography>
                ),
            },
        },
    },
    {
        id: 9,
        columns: {
            name: 'Backup folder',
            version: '1.1',
            description: 'Create a backup of all files in the selected folder',
            lastRunDate: {
                value: '19-05-2020',
                sortValue: new Date('2020-05-19').toISOString(),
            },
            lastRunStatus: 'Passed',
            scheduling: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Production every day' },
                                { content: 'Staging every week' },
                            ]}
                        />
                    </Typography>
                ),
            },
            labels: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Label A' },
                                { content: 'Label B' },
                            ]}
                        />
                    </Typography>
                ),
            },
        },
    },
    {
        id: 10,
        columns: {
            name: 'Backup file',
            version: '1.1',
            description: 'Create a backup of selected file',
            lastRunDate: {
                value: '19-05-2020',
                sortValue: new Date('2020-05-19').toISOString(),
            },
            lastRunStatus: 'Passed',
            scheduling: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Production every day' },
                                { content: 'Staging every week' },
                            ]}
                        />
                    </Typography>
                ),
            },
            labels: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Label A' },
                                { content: 'Label B' },
                            ]}
                        />
                    </Typography>
                ),
            },
        },
    },
    {
        id: 11,
        columns: {
            name: 'Generate email templates',
            version: '2',
            description: 'Create email templates for selected user ids',
            lastRunDate: {
                value: '27-05-2020',
                sortValue: new Date('2020-05-27').toISOString(),
            },
            lastRunStatus: 'Passed',
            scheduling: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Production every day' },
                                { content: 'Staging every week' },
                            ]}
                        />
                    </Typography>
                ),
            },
            labels: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Label A' },
                                { content: 'Label B' },
                            ]}
                        />
                    </Typography>
                ),
            },
        },
    },
    {
        id: 12,
        columns: {
            name: 'Mark all as read',
            version: '2',
            description: 'Marks all emails as read for the given user id',
            lastRunDate: {
                value: '27-05-2020',
                sortValue: new Date('2020-05-27').toISOString(),
            },
            lastRunStatus: 'Failed',
            scheduling: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Production every day' },
                                { content: 'Staging every week' },
                            ]}
                        />
                    </Typography>
                ),
            },
            labels: {
                value: 2,
                tooltip: (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={[
                                { content: 'Label A' },
                                { content: 'Label B' },
                            ]}
                        />
                    </Typography>
                ),
            },
        },
    },
];
