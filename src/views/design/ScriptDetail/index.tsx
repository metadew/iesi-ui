import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, makeStyles } from '@material-ui/core';
import {
    AddRounded as AddIcon,
    Edit as EditIcon,
} from '@material-ui/icons';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import TextInput from 'views/common/input/TextInput';
import DescriptionList from 'views/common/list/DescriptionList';
import { ROUTE_KEYS } from 'views/routes';
import { ListColumns, IListItem } from 'models/list.models';
import GenericDraggableList from 'views/common/list/GenericDraggableList';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel/index';
import { THEME_COLORS } from 'config/themes/colors';
import DetailActions from './DetailActions';

interface IColumnNames {
    name: string;
    description: string;
}


const useStyles = makeStyles(({ palette, spacing, typography }) => ({
    scriptName: {
        fontWeight: typography.fontWeightBold,
        color: palette.primary.main,
    },
    scriptDescription: {
        fontWeight: typography.fontWeightBold,
    },
    scriptNav: {
        padding: `${spacing(0.5)}px ${spacing(1)}px`,
        backgroundColor: THEME_COLORS.GREY_LIGHT,
        '& .MuiIconButton-root': {
            padding: spacing(0.8),
            margin: `${spacing(0.2)}px ${spacing(0.5)}px`,
        },
    },
    addActionButton: {
        backgroundColor: THEME_COLORS.GREY_LIGHT,
    },
}));


const mockedListItems: IListItem<IColumnNames>[] = [{
    id: 1,
    columns: {
        name: 'Fetch',
        description: 'This action fetches the data',
    },
}, {
    id: 2,
    columns: {
        name: 'Sort',
        description: 'This action sorts the data',
    },
}, {
    id: 3,
    columns: {
        name: 'Filter',
        description: 'This action filters the data',
    },
}, {
    id: 4,
    columns: {
        name: 'Display',
        description: 'This action displays the data',
    },
}];

export default function ScriptDetail() {
    const [listItems, setListItems] = useState(mockedListItems);
    const { scriptId } = useParams();
    const classes = useStyles();

    const columns: ListColumns<IColumnNames> = {
        name: {
            fixedWidth: '30%',
            className: classes.scriptName,
        },
        description: {
            fixedWidth: '70%',
            className: classes.scriptDescription,
        },
    };

    const ScriptDetailPanel = () => (
        <Box mt={1} display="flex" flexDirection="column" flex="1 1 auto">
            <Box flex="1 1 auto">
                <form noValidate autoComplete="off">
                    <TextInput
                        id="script-name"
                        label="Scriptname"
                        required
                        error
                        helperText="Scriptname is a required field"
                    />
                    <TextInput
                        id="script-name"
                        label="Scriptname"
                        multiline
                        rows={8}
                        value={`Script detail: ${scriptId}`}
                    />
                </form>
            </Box>
            <Box>
                <DescriptionList
                    items={[
                        { label: 'Version', value: '01' },
                        { label: 'Last run date', value: '10-10-2018' },
                        { label: 'Last run status', value: 'Passed' },
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
                >
                    <Box textAlign="center">
                        <Typography variant="h2" paragraph>
                            <Translate msg="scripts.detail.main.no_actions.title" />
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<AddIcon />}
                        >
                            <Translate msg="scripts.detail.main.no_actions.button" />
                        </Button>
                    </Box>
                </Box>
            );
        }

        return (
            <>
                <Box>
                    <DetailActions
                        onSave={() => console.log('save')}
                        onDelete={() => console.log('delete')}
                        onAdd={() => console.log('add')}
                        onPlay={() => console.log('play')}
                        onViewReport={() => console.log('view report')}
                    />
                </Box>
                <Box marginY={1}>
                    <GenericDraggableList
                        listItems={listItems}
                        columns={columns}
                        listActions={[
                            {
                                icon: <EditIcon />,
                                onClick: (id) => console.log(id),
                            },
                        ]}
                        onOrder={setListItems}
                    />
                </Box>
            </>
        );
    };

    return (
        <ContentWithSidePanel
            panel={<ScriptDetailPanel />}
            content={<ScriptDetailContent />}
            goBackTo={ROUTE_KEYS.R_SCRIPTS}
        />
    );
}
