import React, { useState, useEffect } from 'react';
import { getTranslator } from 'state/i18n/selectors';
import { Box, Typography, Button, makeStyles } from '@material-ui/core';
import {
    AddRounded as AddIcon,
    Edit as EditIcon,
} from '@material-ui/icons';
import { IDummyScriptAction, IScriptAction } from 'models/state/scripts.models';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import TextInput from 'views/common/input/TextInput';
import DescriptionList from 'views/common/list/DescriptionList';
import { ROUTE_KEYS } from 'views/routes';
import { ListColumns, IListItem } from 'models/list.models';
import GenericDraggableList from 'views/common/list/GenericDraggableList';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel/index';
import { THEME_COLORS } from 'config/themes/colors';
import { observe, IObserveProps } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { getAsyncScriptDetail } from 'state/entities/scripts/selectors';

import DetailActions from './DetailActions';
import AddAction from './AddAction';
import EditAction from './EditAction';
import EditLabels from './EditLabels';
import EditSchedules from './EditSchedules';


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

function ScriptDetail({ state }: IObserveProps) {
    const scriptDetail = getAsyncScriptDetail(state).data;
    const scriptDetailAsyncStatus = getAsyncScriptDetail(state).fetch.status;
    const uniqueScriptId = scriptDetail && scriptDetail.name
        ? `${scriptDetail.name}-${scriptDetail.version.number}` : '';

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editAction, setEditAction] = useState<{ action: IScriptAction; index: number }>(null);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [listItems, setListItems] = useState(mockedListItems);

    useEffect(() => {
        const newListItems: IListItem<IColumnNames>[] = scriptDetail && scriptDetail.actions
            ? scriptDetail.actions.map((action) => ({
                id: action.name,
                columns: {
                    name: action.name,
                    description: action.description,
                },
            }))
            : [];
        setListItems(newListItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uniqueScriptId]);

    const classes = useStyles();

    const translator = getTranslator(state);

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
                        value={scriptDetail && scriptDetail.name ? scriptDetail.name : ''}
                    />
                    <TextInput
                        id="script-description"
                        label="Description"
                        multiline
                        rows={8}
                        value={scriptDetail && scriptDetail.description ? scriptDetail.description : ''}
                    />
                </form>
                <DescriptionList
                    noLineAfterListItem
                    items={[
                        {
                            label: <Translate msg="scripts.detail.side.labels.title" />,
                            value: <EditLabels
                                labels={scriptDetail && scriptDetail.labels ? scriptDetail.labels : []}
                            />,
                        },
                        {
                            label: <Translate msg="scripts.detail.side.schedules.title" />,
                            value: <EditSchedules
                                schedules={scriptDetail && scriptDetail.scheduling ? scriptDetail.scheduling : []}
                            />,
                        },
                    ]}
                />
            </Box>
            <Box>
                <DescriptionList
                    items={[
                        {
                            label: translator('scripts.detail.side.description.version'),
                            value: scriptDetail && scriptDetail.version ? scriptDetail.version.number : '',
                        },
                        {
                            label: translator('scripts.detail.side.description.last_run_date'),
                            value: '10-10-2018',
                        },
                        {
                            label: translator('scripts.detail.side.description.last_run_status'),
                            value: 'Passed',
                        },
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
                    paddingBottom={5}
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
                        onDelete={() => setIsConfirmDeleteOpen(true)}
                        onAdd={() => setIsAddOpen(true)}
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
                                label: <Translate msg="scripts.detail.main.list.item.actions.edit" />,
                                onClick: (id, index) => {
                                    const action = scriptDetail.actions.find((item) => item.name === id);
                                    setEditAction({ action, index });
                                },
                            },
                        ]}
                        onOrder={setListItems}
                    />
                </Box>
            </>
        );
    };

    const AddScriptContent = () => (
        <AddAction
            onClose={onCloseAddAction}
            onAdd={onAddActions}
        />
    );

    const EditActionContent = () => (
        <EditAction
            onClose={onCloseEditAction}
            action={editAction.action}
            index={editAction.index}
        />
    );

    return (
        <>
            <ContentWithSidePanel
                panel={<ScriptDetailPanel />}
                content={<ScriptDetailContent />}
                goBackTo={ROUTE_KEYS.R_SCRIPTS}
                contentOverlay={editAction ? <EditActionContent /> : <AddScriptContent />}
                contentOverlayOpen={!!editAction || isAddOpen}
                toggleLabel={<Translate msg="scripts.detail.side.toggle_button" />}
                showLoader={scriptDetailAsyncStatus}
            />
            <ConfirmationDialog
                title={translator('scripts.detail.delete_script_dialog.title')}
                text={translator('scripts.detail.delete_script_dialog.text')}
                open={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={() => setIsConfirmDeleteOpen(false)} // TODO: actually delete script
            />
        </>
    );

    function onCloseAddAction() {
        setIsAddOpen(false);
    }

    function onCloseEditAction() {
        setEditAction(null);
    }

    function onAddActions(actions: IDummyScriptAction[]) {
        const newListItems: IListItem<IColumnNames>[] = actions.map((action) => ({
            id: action.id,
            columns: {
                name: action.name,
                description: action.description,
            },
        }));
        setListItems([...listItems, ...newListItems]);
        onCloseAddAction();
    }
}

export default observe([
    StateChangeNotification.I18N_TRANSLATIONS,
    StateChangeNotification.DESIGN_SCRIPTS_DETAIL,
], ScriptDetail);
