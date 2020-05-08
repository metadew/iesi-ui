import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, makeStyles, IconButton } from '@material-ui/core';
import {
    AddRounded as AddIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    PlayArrow as PlayIcon,
    Delete as DeleteIcon,
} from '@material-ui/icons';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import TextInput from 'views/common/input/TextInput';
import DescriptionList from 'views/common/list/DescriptionList';
import { ROUTE_KEYS } from 'views/routes';
import { ListColumns, IListItem } from 'models/list.models';
import GenericDraggableList from 'views/common/list/GenericDraggableList';
import ContentWithSidePanel from '../../common/layout/ContentWithSidePanel/index';

interface IColumnNames {
    name: string;
    description: string;
}


const useStyles = makeStyles(({ palette, typography, overrides, shape, spacing }) => ({
    scriptName: {
        fontWeight: typography.fontWeightBold,
        color: palette.primary.main,
    },
    scriptDescription: {
        fontWeight: typography.fontWeightBold,
    },
    addButton: overrides.MuiButton.contained,
    actions: {
        borderRadius: shape.borderRadius,
        backgroundColor: palette.grey[200],
    },
    action: {
        '&:not(:first-child)': {
            marginLeft: spacing(1),
        },
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
            <Box>
                <Box
                    paddingLeft={5}
                    paddingRight={5}
                    marginBottom={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <IconButton className={classes.addButton} onClick={() => console.log('add')}>
                        <AddIcon fontSize="large" />
                    </IconButton>
                    <Box className={classes.actions} padding={0.8}>
                        <Button
                            className={classes.action}
                            size="small"
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={() => console.log('save')}
                        >
                            <Translate msg="common.action.save" />
                        </Button>
                        <IconButton className={classes.action} size="small" onClick={() => console.log('del')}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton className={classes.action} size="small" onClick={() => console.log('play')}>
                            <PlayIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
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
