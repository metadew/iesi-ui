import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, makeStyles } from '@material-ui/core';
import {
    AddRounded as AddIcon,
    Edit as EditIcon,
} from '@material-ui/icons';
import { IDummyScriptAction } from 'models/state/scripts.models';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import TextInput from 'views/common/input/TextInput';
import DescriptionList from 'views/common/list/DescriptionList';
import { ROUTE_KEYS } from 'views/routes';
import { ListColumns, IListItem } from 'models/list.models';
import GenericDraggableList from 'views/common/list/GenericDraggableList';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel/index';
import { THEME_COLORS } from 'config/themes/colors';
import ButtonWithContent from 'views/common/input/ButtonWithContent';
import TextInputWithButton from 'views/common/input/TextInputWithButton';
import OrderedList from 'views/common/list/OrderedList';
import useOutsideClick from 'utils/hooks/useOutsideClick';

import DetailActions from './DetailActions';
import AddAction from './AddAction';

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

const mockedLabels = [
    {
        id: 'label-1',
        value: 'Label 1',
    }, {
        id: 'label-2',
        value: 'Label 2',
    },
];

const mockedSchedules = [
    {
        id: 'schedule-1',
        value: 'Production every day',
    }, {
        id: 'schedule-2',
        value: 'Staging every hour',
    },
];

export default function ScriptDetail() {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const labelsButtonWithContentRef = useRef(null);
    const schedulesButtonWithContentRef = useRef(null);
    const [listItems, setListItems] = useState(mockedListItems);
    const [labels, setLabels] = useState(mockedLabels);
    const [schedules, setSchedules] = useState(mockedSchedules);
    const [isAddLabelFormOpen, setIsAddLabelFormOpen] = useState(false);
    const [isAddScheduleFormOpen, setIsScheduleLabelFormOpen] = useState(false);
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

    useOutsideClick({
        ref: labelsButtonWithContentRef,
        callback: () => {
            if (isAddLabelFormOpen) {
                setIsAddLabelFormOpen(false);
            }
        },
    });

    useOutsideClick({
        ref: schedulesButtonWithContentRef,
        callback: () => {
            if (isAddScheduleFormOpen) {
                setIsScheduleLabelFormOpen(false);
            }
        },
    });

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
                        id="script-description"
                        label="Description"
                        multiline
                        rows={8}
                        value={`Script detail: ${scriptId}`}
                    />
                </form>
                <DescriptionList
                    noLineAfterListItem
                    items={[
                        {
                            label: <Translate msg="scripts.detail.side.labels.title" />,
                            value: (
                                <>
                                    {labels.length > 0 ? (
                                        <OrderedList
                                            items={labels.map((label) => ({
                                                content: label.value,
                                                onDelete: () => setLabels(labels.filter((l) => l.id !== label.id)),
                                            }))}
                                        />
                                    ) : (
                                        <Translate msg="scripts.detail.side.labels.empty" />
                                    )}
                                    <ButtonWithContent
                                        buttonText={<Translate msg="scripts.detail.side.labels.add_button" />}
                                        isOpen={isAddLabelFormOpen}
                                        onOpenIntent={() => setIsAddLabelFormOpen(true)}
                                        onCloseIntent={() => setIsAddLabelFormOpen(false)}
                                        forwardRef={labelsButtonWithContentRef}
                                    >
                                        <TextInputWithButton
                                            inputProps={{
                                                id: 'new-label',
                                                placeholder: 'scripts.detail.side.labels.add_new.placeholder',
                                                'aria-label': 'new label',
                                            }}
                                            buttonText={<Translate msg="scripts.detail.side.labels.add_new.button" />}
                                            onSubmit={(value) => {
                                                if (value) {
                                                    setLabels([...labels, { id: JSON.stringify(value), value }]);
                                                }
                                                setIsAddLabelFormOpen(false);
                                            }}
                                        />
                                    </ButtonWithContent>
                                </>
                            ),
                        },
                        {
                            label: <Translate msg="scripts.detail.side.schedules.title" />,
                            value: (
                                <>
                                    {schedules.length > 0 ? (
                                        <OrderedList
                                            items={schedules.map((schedule) => ({
                                                content: schedule.value,
                                                onDelete: () => setLabels(labels.filter((l) => l.id !== schedule.id)),
                                            }))}
                                        />
                                    ) : (
                                        <Translate msg="No schedules" />
                                    )}
                                    <ButtonWithContent
                                        buttonText={<Translate msg="scripts.detail.side.schedules.add_button" />}
                                        isOpen={isAddScheduleFormOpen}
                                        onOpenIntent={() => setIsScheduleLabelFormOpen(true)}
                                        onCloseIntent={() => setIsScheduleLabelFormOpen(false)}
                                        forwardRef={schedulesButtonWithContentRef}
                                    >
                                        <TextInputWithButton
                                            inputProps={{
                                                id: 'new-schedule',
                                                placeholder: 'scripts.detail.side.schedules.add_new.placeholder',
                                                'aria-label': 'New schedule',
                                            }}
                                            buttonText={
                                                <Translate msg="scripts.detail.side.schedules.add_new.button" />
                                            }
                                            onSubmit={(value) => {
                                                if (value) {
                                                    setSchedules([...schedules, { id: JSON.stringify(value), value }]);
                                                }
                                                setIsScheduleLabelFormOpen(false);
                                            }}
                                        />
                                    </ButtonWithContent>
                                </>
                            ),
                        },
                    ]}
                />
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
                                onClick: (id) => console.log(id),
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

    return (
        <>
            <ContentWithSidePanel
                panel={<ScriptDetailPanel />}
                content={<ScriptDetailContent />}
                goBackTo={ROUTE_KEYS.R_SCRIPTS}
                contentOverlay={<AddScriptContent />}
                contentOverlayOpen={isAddOpen}
            />
            <ConfirmationDialog
                title={<Translate msg="scripts.detail.delete_script_dialog.title" />}
                text={<Translate msg="scripts.detail.delete_script_dialog.text" />}
                open={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={() => setIsConfirmDeleteOpen(false)} // TODO: actually delete script
            />
        </>
    );

    function onCloseAddAction() {
        setIsAddOpen(false);
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
