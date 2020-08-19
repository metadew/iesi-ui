import React, { ReactText } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import clone from 'ramda/es/clone';
import { getTranslator } from 'state/i18n/selectors';
import { Box, Typography, Button, withStyles, createStyles, Theme, WithStyles, Collapse } from '@material-ui/core';
import {
    AddRounded as AddIcon,
    Edit as EditIcon,
} from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { IScript, IScriptAction } from 'models/state/scripts.models';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import TextInput from 'views/common/input/TextInput';
import DescriptionList from 'views/common/list/DescriptionList';
import { ROUTE_KEYS, getRouteKeyByPath, redirectTo } from 'views/routes';
import { ListColumns, IListItem } from 'models/list.models';
import GenericDraggableList from 'views/common/list/GenericDraggableList';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel/index';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import { THEME_COLORS } from 'config/themes/colors';
import { observe, IObserveProps } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { getAsyncScriptDetail } from 'state/entities/scripts/selectors';
import { getUniqueIdFromScript } from 'utils/scripts/scriptUtils';
import { getAsyncActionTypes } from 'state/entities/constants/selectors';
import { triggerResetAsyncExecutionRequest } from 'state/entities/executionRequests/triggers';
import { AsyncStatus, AsyncOperation } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import Loader from 'views/common/waiting/Loader';
import {
    triggerUpdateScriptDetail,
    triggerCreateScriptDetail,
    triggerDeleteScriptDetail,
} from 'state/entities/scripts/triggers';
import { TRequiredFieldsState } from 'models/form.models';
import requiredFieldsCheck from 'utils/form/requiredFieldsCheck';
import ExecuteScriptDialog from '../common/ExecuteScriptDialog';

import DetailActions from './DetailActions';
import AddAction from './AddAction';
import EditAction from './EditAction';
import EditLabels from './EditLabels';

interface IColumnNames {
    type: string;
    name: string;
}

interface IData {
    number: number;
}

const styles = ({ palette, spacing, typography }: Theme) =>
    createStyles({
        scriptName: {
            fontWeight: typography.fontWeightBold,
        },
        scriptType: {
            color: palette.primary.main,
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
    isSaveDialogOpen: boolean;
    editActionIndex: number;
    newScriptDetail: IScript;
    hasChangesToCheck: boolean;
    requiredFieldsState: TRequiredFieldsState<IScript>;
    scriptIdToExecute: string;
}

const ScriptDetail = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps & RouteComponentProps, IComponentState> {
        public constructor(props: TProps & IObserveProps & RouteComponentProps) {
            super(props);

            this.state = {
                isAddOpen: false,
                isConfirmDeleteOpen: false,
                isSaveDialogOpen: false,
                editActionIndex: -1,
                newScriptDetail: {
                    actions: [],
                    description: '',
                    labels: [],
                    name: '',
                    parameters: [],
                    version: {
                        description: '',
                        number: 0,
                    },
                    scheduling: [],
                    execution: {
                        mostRecent: [],
                        total: 0,
                    },
                },
                hasChangesToCheck: false,
                requiredFieldsState: {
                    name: {
                        showError: false,
                    },
                },
                scriptIdToExecute: null,
            };

            this.renderAddScriptContent = this.renderAddScriptContent.bind(this);
            this.renderEditActionContent = this.renderEditActionContent.bind(this);
            this.renderScriptDetailPanel = this.renderScriptDetailPanel.bind(this);
            this.renderScriptDetailContent = this.renderScriptDetailContent.bind(this);

            this.onAddActions = this.onAddActions.bind(this);
            this.updateScript = this.updateScript.bind(this);

            this.getEditAction = this.getEditAction.bind(this);

            this.isCreateScriptRoute = this.isCreateScriptRoute.bind(this);

            this.updateScriptInStateIfNewScriptWasLoaded = this.updateScriptInStateIfNewScriptWasLoaded.bind(this);
            this.navigateToScriptAfterCreation = this.navigateToScriptAfterCreation.bind(this);
            this.navigateToScriptAfterDeletion = this.navigateToScriptAfterDeletion.bind(this);

            this.onDeleteScript = this.onDeleteScript.bind(this);
            this.onCloseExecuteDialog = this.onCloseExecuteDialog.bind(this);
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            this.updateScriptInStateIfNewScriptWasLoaded(prevProps);
            this.navigateToScriptAfterCreation(prevProps);
            this.navigateToScriptAfterDeletion(prevProps);
        }

        public render() {
            const { state } = this.props;
            const { isAddOpen, isConfirmDeleteOpen, isSaveDialogOpen, newScriptDetail, scriptIdToExecute } = this.state;

            // State
            const scriptDetailAsyncStatus = getAsyncScriptDetail(state).fetch.status;
            const actionTypesAsyncStatus = getAsyncActionTypes(state).fetch.status;
            const translator = getTranslator(state);
            const deleteStatus = getAsyncScriptDetail(this.props.state).remove.status;

            const editAction = this.getEditAction();

            return (
                <>
                    <Loader
                        show={
                            scriptDetailAsyncStatus === AsyncStatus.Busy
                            || actionTypesAsyncStatus === AsyncStatus.Busy
                        }
                    />
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
                        onConfirm={this.onDeleteScript}
                        showLoader={deleteStatus === AsyncStatus.Busy}
                    />
                    <ExecuteScriptDialog
                        scriptUniqueId={getUniqueIdFromScript(newScriptDetail)}
                        open={!!scriptIdToExecute}
                        onClose={this.onCloseExecuteDialog}
                    />
                    <ClosableDialog
                        title={translator('scripts.detail.save_script_dialog.title')}
                        open={isSaveDialogOpen}
                        onClose={() => this.setState({ isSaveDialogOpen: false })}
                    >
                        <Typography>
                            <Translate msg="scripts.detail.save_script_dialog.text" />
                        </Typography>
                        <Box display="flex" alignItems="center" justifyContent="space-between" marginTop={2}>
                            <Box paddingRight={1}>
                                <Button
                                    id="save-update-current-version"
                                    onClick={() => {
                                        triggerUpdateScriptDetail({ ...newScriptDetail });
                                        this.setState({ isSaveDialogOpen: false });
                                    }}
                                    variant="contained"
                                    color="secondary"
                                    disabled={this.isCreateScriptRoute()}
                                >
                                    <Translate msg="scripts.detail.save_script_dialog.update_current_version" />
                                </Button>
                            </Box>
                            <Box paddingLeft={1}>
                                <Button
                                    id="save-save-as-new-version"
                                    onClick={() => {
                                        triggerCreateScriptDetail({
                                            ...newScriptDetail,
                                            version: {
                                                ...newScriptDetail.version,
                                                number: this.isCreateScriptRoute()
                                                    ? 0 : newScriptDetail.version.number + 1,
                                            },
                                        });
                                        this.setState({ isSaveDialogOpen: false });
                                    }}
                                    color="secondary"
                                    variant="outlined"
                                >
                                    <Translate msg="scripts.detail.save_script_dialog.save_as_new_version" />
                                </Button>
                            </Box>
                        </Box>
                    </ClosableDialog>
                </>
            );
        }

        private onAddActions(actions: IScriptAction[]) {
            const { newScriptDetail } = this.state;
            this.updateScript({
                actions: [
                    ...newScriptDetail.actions,
                    ...actions.map((item, index) => ({
                        ...item,
                        number: newScriptDetail.actions.length + (index + 1),
                    })),
                ],
            });
            this.setState({ isAddOpen: false });
        }

        private renderScriptDetailPanel() {
            const { newScriptDetail, requiredFieldsState } = this.state;
            const { state } = this.props;

            const translator = getTranslator(state);

            return (
                <Box mt={1} display="flex" flexDirection="column" flex="1 1 auto">
                    <Box flex="1 1 auto">
                        <form noValidate autoComplete="off">
                            <TextInput
                                id="script-name"
                                label={translator('scripts.detail.side.script_name')}
                                required
                                error={requiredFieldsState.name.showError}
                                helperText={requiredFieldsState.name.showError && 'Scriptname is a required field'}
                                value={newScriptDetail && newScriptDetail.name
                                    ? newScriptDetail.name : ''}
                                onChange={(e) => this.updateScript({ name: e.target.value })}
                            />
                            <TextInput
                                id="script-description"
                                label={translator('scripts.detail.side.script_description')}
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
                                    value: newScriptDetail.execution.mostRecent[0]
                                        ? newScriptDetail.execution.mostRecent[0]?.startTimestamp
                                        : '-',
                                },
                            ]}
                        />
                    </Box>
                </Box>
            );
        }

        private renderScriptDetailContent() {
            const { classes } = this.props;
            const { newScriptDetail, hasChangesToCheck } = this.state;

            const listItems = getSortedListItemsFromScriptDetail(newScriptDetail);
            const hasActions = listItems.length > 0;

            const handleSaveAction = () => {
                const { passed, requiredFieldsState } = requiredFieldsCheck({
                    data: newScriptDetail,
                    requiredFields: ['name'],
                });
                this.setState({ requiredFieldsState });

                if (passed) {
                    this.setState({ hasChangesToCheck: false });
                    this.setState({ isSaveDialogOpen: true });
                }
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
                                onClick={() => this.setState({ isAddOpen: true })}
                            >
                                <Translate msg="scripts.detail.main.no_actions.button" />
                            </Button>
                        </Box>
                    </Box>
                );
            }

            const columns: ListColumns<IColumnNames> = {
                type: {
                    fixedWidth: '40%',
                    className: classes.scriptType,
                },
                name: {
                    fixedWidth: '60%',
                    className: classes.scriptName,
                },
            };

            return (
                <>
                    <Box>
                        <Collapse in={hasChangesToCheck}>
                            <Box marginX={2} marginBottom={2}>
                                <Alert severity="warning">
                                    <Translate msg="scripts.detail.main.alert.save_changes" />
                                </Alert>
                            </Box>
                        </Collapse>
                        <DetailActions
                            onSave={handleSaveAction}
                            onDelete={() => this.setState({ isConfirmDeleteOpen: true })}
                            onAdd={() => this.setState({ isAddOpen: true })}
                            onPlay={() => this.setScriptToExecute(getUniqueIdFromScript(newScriptDetail))}
                            onViewReport={() => {
                                redirectTo({
                                    routeKey: ROUTE_KEYS.R_REPORTS,
                                    queryParams: {
                                        name: newScriptDetail && newScriptDetail.name,
                                        version: newScriptDetail && newScriptDetail.version
                                            ? newScriptDetail.version.number : null,
                                    },
                                });
                            }}
                            isCreateRoute={this.isCreateScriptRoute()}
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
                                        const typedItem = item as IListItem<IColumnNames, IData>;
                                        const action = newScriptDetail.actions.find((a) => (
                                            a.name === typedItem.id && a.number === typedItem.data.number
                                        ));
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
                    onAdd={this.onAddActions}
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
            this.setState((prevState) => ({
                newScriptDetail: {
                    ...prevState.newScriptDetail,
                    ...fieldsToUpdate,
                },
            }));

            this.setState({ hasChangesToCheck: true });
        }

        private onDeleteScript() {
            const { state } = this.props;
            const detail = getAsyncScriptDetail(state).data;
            if (detail) {
                triggerDeleteScriptDetail({ name: detail.name, version: detail.version.number });
            }
        }

        private getEditAction() {
            const { newScriptDetail, editActionIndex } = this.state;
            if (editActionIndex === -1) {
                return null;
            }
            return newScriptDetail && newScriptDetail.actions && newScriptDetail.actions[editActionIndex];
        }

        private setScriptToExecute(id: ReactText) {
            this.setState({ scriptIdToExecute: id as string });
        }

        private onCloseExecuteDialog() {
            triggerResetAsyncExecutionRequest({ operation: AsyncOperation.create });
            this.setState({ scriptIdToExecute: null });
        }

        private updateScriptInStateIfNewScriptWasLoaded(prevProps: TProps & IObserveProps) {
            const scriptDetail = getAsyncScriptDetail(this.props.state).data;
            const prevScriptDetail = getAsyncScriptDetail(prevProps.state).data;
            if (getUniqueIdFromScript(scriptDetail) !== getUniqueIdFromScript(prevScriptDetail)) {
                const scriptDetailDeepClone = clone(scriptDetail);
                // eslint-disable-next-line react/no-did-update-set-state
                this.setState({ newScriptDetail: scriptDetailDeepClone });
            }
        }

        private navigateToScriptAfterCreation(prevProps: TProps & IObserveProps) {
            const { newScriptDetail } = this.state;
            const { status } = getAsyncScriptDetail(this.props.state).create;
            const prevStatus = getAsyncScriptDetail(prevProps.state).create.status;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                redirectTo({
                    routeKey: ROUTE_KEYS.R_SCRIPT_DETAIL,
                    params: {
                        name: newScriptDetail.name,
                        version: this.isCreateScriptRoute() ? 0 : newScriptDetail.version.number + 1,
                    },
                });
            }
        }

        private navigateToScriptAfterDeletion(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncScriptDetail(this.props.state).remove;
            const prevStatus = getAsyncScriptDetail(prevProps.state).remove.status;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                redirectTo({
                    routeKey: ROUTE_KEYS.R_SCRIPTS,
                });
            }
        }

        private isCreateScriptRoute() {
            const currentRouteKey = getRouteKeyByPath({ path: this.props.match.path });
            return currentRouteKey === ROUTE_KEYS.R_SCRIPT_NEW;
        }
    },
);

function getSortedListItemsFromScriptDetail(detail: IScript) {
    const newListItems: IListItem<IColumnNames, IData>[] = detail && detail.actions
        ? detail.actions
            .sort((a, b) => (a.number < b.number ? -1 : a.number > b.number ? 1 : 0))
            .map((action) => ({
                id: action.name,
                columns: {
                    type: action.type,
                    name: action.name,
                },
                data: {
                    number: action.number,
                },
            }))
        : [];
    return newListItems;
}

export default observe([
    StateChangeNotification.I18N_TRANSLATIONS,
    StateChangeNotification.DESIGN_SCRIPTS_DETAIL,
    StateChangeNotification.CONSTANTS_ACTION_TYPES,
    // This is a typign mismatch, but does not cause an actual problem
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
], withRouter(ScriptDetail));
