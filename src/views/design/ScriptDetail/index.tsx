import React from 'react';
import clone from 'ramda/es/clone';
import { getTranslator } from 'state/i18n/selectors';
import { Box, Typography, Button, withStyles, createStyles, Theme, WithStyles, Collapse } from '@material-ui/core';
import {
    AddRounded as AddIcon,
    Edit as EditIcon,
} from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { IScript } from 'models/state/scripts.models';
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
import { getUniqueIdFromScript } from 'utils/scripts/scripts';

import Loader from 'views/common/waiting/Loader';
import DetailActions from './DetailActions';
import AddAction from './AddAction';
import EditAction from './EditAction';
import EditLabels from './EditLabels';


interface IColumnNames {
    name: string;
    description: string;
}

const styles = ({ palette, spacing, typography }: Theme) =>
    createStyles({
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
    });

type TProps = WithStyles<typeof styles>;

interface IComponentState {
    isAddOpen: boolean;
    isConfirmDeleteOpen: boolean;
    editActionIndex: number;
    newScriptDetail: IScript;
    checked: boolean;
}

const ScriptDetail = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, IComponentState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);

            this.state = {
                isAddOpen: false,
                isConfirmDeleteOpen: false,
                editActionIndex: -1,
                newScriptDetail: null,
                checked: true, // TODO: should be false by default
            };

            this.renderAddScriptContent = this.renderAddScriptContent.bind(this);
            this.renderEditActionContent = this.renderEditActionContent.bind(this);
            this.renderScriptDetailPanel = this.renderScriptDetailPanel.bind(this);
            this.renderScriptDetailContent = this.renderScriptDetailContent.bind(this);

            this.updateScript = this.updateScript.bind(this);

            this.getEditAction = this.getEditAction.bind(this);
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            const scriptDetail = getAsyncScriptDetail(this.props.state).data;
            const prevScriptDetail = getAsyncScriptDetail(prevProps.state).data;
            if (getUniqueIdFromScript(scriptDetail) !== getUniqueIdFromScript(prevScriptDetail)) {
                const scriptDetailDeepClone = clone(scriptDetail);
                // eslint-disable-next-line react/no-did-update-set-state
                this.setState({ newScriptDetail: scriptDetailDeepClone });
            }
        }

        public render() {
            const { state } = this.props;
            const { isAddOpen, isConfirmDeleteOpen } = this.state;

            // State
            const scriptDetailAsyncStatus = getAsyncScriptDetail(state).fetch.status;
            const translator = getTranslator(state);

            const editAction = this.getEditAction();

            return (
                <>
                    <Loader show={scriptDetailAsyncStatus} />
                    <ContentWithSidePanel
                        panel={this.renderScriptDetailPanel()}
                        content={this.renderScriptDetailContent()}
                        goBackTo={ROUTE_KEYS.R_SCRIPTS}
                        contentOverlay={editAction ? this.renderEditActionContent() : this.renderAddScriptContent()}
                        contentOverlayOpen={!!editAction || isAddOpen}
                        toggleLabel={<Translate msg="scripts.detail.side.toggle_button" />}
                    />
                    <ConfirmationDialog
                        title={translator('scripts.detail.delete_script_dialog.title')}
                        text={translator('scripts.detail.delete_script_dialog.text')}
                        open={isConfirmDeleteOpen}
                        onClose={() => this.setState({ isConfirmDeleteOpen: false })}
                        onConfirm={() => this.setState({ isConfirmDeleteOpen: false })} // TODO: actually delete script
                    />
                </>
            );

            // function onAddActions(actions: IDummyScriptAction[]) {
            //     const newListItems: IListItem<IColumnNames>[] = actions.map((action) => ({
            //         id: action.id,
            //         columns: {
            //             name: action.name,
            //             description: action.description,
            //         },
            //     }));
            //     setListItems([...listItems, ...newListItems]);
            //     onCloseAddAction();
            // }
        }

        private renderScriptDetailPanel() {
            const { newScriptDetail } = this.state;
            const { state } = this.props;

            const translator = getTranslator(state);

            return (
                <Box mt={1} display="flex" flexDirection="column" flex="1 1 auto">
                    <Box flex="1 1 auto">
                        <form noValidate autoComplete="off">
                            <TextInput
                                id="script-name"
                                label="Scriptname"
                                required
                                error
                                helperText="Scriptname is a required field"
                                value={newScriptDetail && newScriptDetail.name
                                    ? newScriptDetail.name : ''}
                                onChange={(e) => this.updateScript({ name: e.target.value })}
                            />
                            <TextInput
                                id="script-description"
                                label="Description"
                                multiline
                                rows={8}
                                value={newScriptDetail && newScriptDetail.description
                                    ? newScriptDetail.description : ''}
                                onChange={(e) => this.updateScript({ description: e.target.value })}
                            />
                        </form>
                        <DescriptionList
                            noLineAfterListItem
                            items={[
                                {
                                    label: <Translate msg="scripts.detail.side.labels.title" />,
                                    value: <EditLabels
                                        labels={newScriptDetail && newScriptDetail.labels
                                            ? newScriptDetail.labels : []}
                                        onChange={(labels) => this.updateScript({ labels })}
                                    />,
                                },
                                // Hide schedules for now
                                // {
                                //     label: <Translate msg="scripts.detail.side.schedules.title" />,
                                //     value: <EditSchedules
                                //         schedules={newScriptDetail && newScriptDetail.scheduling
                                //             ? newScriptDetail.scheduling : []}
                                //         onChange={(scheduling) => this.updateScript({ scheduling })}
                                //     />,
                                // },
                            ]}
                        />
                    </Box>
                    <Box>
                        <DescriptionList
                            items={[
                                {
                                    label: translator('scripts.detail.side.description.version'),
                                    value: newScriptDetail && newScriptDetail.version
                                        ? newScriptDetail.version.number : '',
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
        }

        private renderScriptDetailContent() {
            const { classes } = this.props;
            const { newScriptDetail, checked } = this.state;

            const listItems = getSortedListItemsFromScriptDetail(newScriptDetail);
            const hasActions = listItems.length > 0;

            const handleChange = () => {
                this.setState({ checked: !checked });
            };

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

            return (
                <>
                    <Box>
                        <Collapse in={checked}>
                            <Box marginX={2} marginBottom={2}>
                                <Alert severity="warning">
                                    <Translate msg="scripts.detail.main.alert.save_changes" />
                                </Alert>
                            </Box>
                        </Collapse>
                        <DetailActions
                            // onSave={() => console.log('save')}
                            onSave={handleChange}
                            onDelete={() => this.setState({ isConfirmDeleteOpen: true })}
                            onAdd={() => this.setState({ isAddOpen: true })}
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
                                        this.setState({ editActionIndex: index });
                                    },
                                },
                            ]}
                            onOrder={(list) => {
                                this.updateScript({
                                    actions: list.map((item, index) => {
                                        const action = newScriptDetail.actions.find((a) => a.name === item.id);
                                        return {
                                            ...action,
                                            // Order starts from 1
                                            number: index + 1,
                                        };
                                    }),
                                });
                            }}
                        />
                    </Box>
                </>
            );
        }

        private renderAddScriptContent() {
            return (
                <AddAction
                    onClose={() => this.setState({ isAddOpen: false })}
                    onAdd={() => this.setState({ isAddOpen: false })}
                />
            );
        }

        private renderEditActionContent() {
            const { newScriptDetail, editActionIndex } = this.state;
            return (
                <EditAction
                    onClose={() => this.setState({ editActionIndex: -1 })}
                    action={this.getEditAction()}
                    onEdit={(newAction) => {
                        const newActions = [...newScriptDetail.actions];
                        newActions[editActionIndex] = newAction;
                        this.updateScript({ actions: newActions });
                    }}
                />
            );
        }

        private updateScript(fieldsToUpdate: Partial<IScript>) {
            console.log({
                // eslint-disable-next-line react/no-access-state-in-setstate
                ...this.state.newScriptDetail,
                ...fieldsToUpdate,
            });

            this.setState((prevState) => ({
                newScriptDetail: {
                    ...prevState.newScriptDetail,
                    ...fieldsToUpdate,
                },
            }));
        }

        private getEditAction() {
            const { newScriptDetail, editActionIndex } = this.state;
            if (editActionIndex === -1) {
                return null;
            }
            return newScriptDetail && newScriptDetail.actions && newScriptDetail.actions[editActionIndex];
        }
    },
);

function getSortedListItemsFromScriptDetail(detail: IScript) {
    const newListItems: IListItem<IColumnNames>[] = detail && detail.actions
        ? detail.actions
            .sort((a, b) => (a.number < b.number ? -1 : a.number > b.number ? 1 : 0))
            .map((action) => ({
                id: action.name,
                columns: {
                    name: action.name,
                    description: action.description,
                },
            }))
        : [];
    return newListItems;
}

export default observe([
    StateChangeNotification.I18N_TRANSLATIONS,
    StateChangeNotification.DESIGN_SCRIPTS_DETAIL,
], ScriptDetail);
