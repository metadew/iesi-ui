import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { clone } from 'ramda';
import { getUniqueIdFromDataset } from 'utils/datasets/datasetUtils';
import { IObserveProps, observe } from 'views/observe';
import { Box, Collapse, createStyles, Typography, WithStyles, withStyles, Button } from '@material-ui/core';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel';
import { IDatasetBase, IDatasetImplementation, IDatasetImplementationColumn } from 'models/state/datasets.model';
import TextInput from 'views/common/input/TextInput';
import { getTranslator } from 'state/i18n/selectors';
import { getRouteKeyByPath, ROUTE_KEYS, redirectTo } from 'views/routes';
import { TRequiredFieldsState } from 'models/form.models';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { Alert } from '@material-ui/lab';
import GenericList from 'views/common/list/GenericList';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
import Loader from 'views/common/waiting/Loader';
import { IListItem, ListColumns } from 'models/list.models';
import { Add, Edit, Delete, FileCopy } from '@material-ui/icons';
import { getAsyncDatasetDetail } from 'state/entities/datasets/selectors';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import entitiesStateManager from 'state/entities/entitiesStateManager';
import {
    triggerCreateDatasetDetail,
    triggerDeleteDatasetDetail,
    triggerExportDatasetDetail,
    triggerFetchDatasetImplementations,
    triggerUpdateDatasetDetail,
} from 'state/entities/datasets/triggers';
import { checkAuthority } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import requiredFieldsCheck from 'utils/form/requiredFieldsCheck';
import { StateChangeNotification } from 'models/state.models';
import DescriptionList from 'views/common/list/DescriptionList';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import DuplicateImplementationDialog from './DuplicateImplementationDialog';
import EditImplementation from './EditImplementation';
import DetailActions from './DetailActions';

const styles = () => createStyles({});

type TProps = WithStyles<typeof styles>;

interface IComponentState {
    newDatasetDetail: IDatasetBase;
    implementationIndexToEdit: number;
    implementationIndexToDelete: number;
    implementationIndexToDuplicate: number;
    hasChangesToCheck: boolean;
    isAddOpen: boolean;
    isSaveDialogOpen: boolean;
    isConfirmDeleteComponentOpen: boolean;
    requiredFieldsState: TRequiredFieldsState<IDatasetBase>;
}

const initialDatasetDetail: IDatasetBase = {
    name: '',
    securityGroupName: '',
    implementations: [],
};

const DatasetDetail = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps & RouteComponentProps, IComponentState> {
        public constructor(props: TProps & IObserveProps & RouteComponentProps) {
            super(props);
            this.state = {
                newDatasetDetail: initialDatasetDetail,
                implementationIndexToEdit: null,
                implementationIndexToDelete: null,
                implementationIndexToDuplicate: null,
                hasChangesToCheck: false,
                isAddOpen: false,
                isSaveDialogOpen: false,
                isConfirmDeleteComponentOpen: false,
                requiredFieldsState: {
                    name: {
                        showError: false,
                    },
                    securityGroupName: {
                        showError: false,
                    },
                },
            };

            this.renderDatasetDetailPanel = this.renderDatasetDetailPanel.bind(this);
            this.renderDatasetDetailContent = this.renderDatasetDetailContent.bind(this);
            this.renderAddOrEditImplementation = this.renderAddOrEditImplementation.bind(this);
            this.isCreateDatasetRoute = this.isCreateDatasetRoute.bind(this);
            this.updateDataset = this.updateDataset.bind(this);
            this.onAddImplementation = this.onAddImplementation.bind(this);
            this.onDeleteImplementation = this.onDeleteImplementation.bind(this);

            this.updateDatasetInStateIfNewDatasetWasLoaded = this.updateDatasetInStateIfNewDatasetWasLoaded.bind(this);
            this.navigateToDatasetAfterCreation = this.navigateToDatasetAfterCreation.bind(this);
            this.navigateToDatasetsAfterDeletion = this.navigateToDatasetsAfterDeletion.bind(this);

            this.onDeleteDataset = this.onDeleteDataset.bind(this);
            this.onExportDataset = this.onExportDataset.bind(this);
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            this.updateDatasetInStateIfNewDatasetWasLoaded(prevProps);
            this.navigateToDatasetAfterCreation(prevProps);
            this.navigateToDatasetsAfterDeletion(prevProps);
        }

        public render() {
            const { state } = this.props;
            const {
                newDatasetDetail,
                isAddOpen,
                implementationIndexToEdit,
                implementationIndexToDelete,
                implementationIndexToDuplicate,
                isSaveDialogOpen,
                isConfirmDeleteComponentOpen,
            } = this.state;
            const datasetImplementationsAsyncInfo = entitiesStateManager.getAsyncEntity({
                asyncEntityKey: ASYNC_ENTITY_KEYS.datasetImplementations,
            }).fetch;
            const datasetDetail = getAsyncDatasetDetail(state).data;
            const translator = getTranslator(state);
            const deleteStatus = getAsyncDatasetDetail(state).remove.status;

            return (
                <>
                    <ContentWithSidePanel
                        panel={this.renderDatasetDetailPanel()}
                        content={datasetImplementationsAsyncInfo.status === AsyncStatus.Busy ? (
                            <Loader show />
                        ) : this.renderDatasetDetailContent()}
                        contentOverlay={this.renderAddOrEditImplementation()}
                        contentOverlayOpen={isAddOpen || implementationIndexToEdit !== null}
                        toggleLabel={<Translate msg="datasets.detail.side.toggle_button" />}
                        goBackTo={ROUTE_KEYS.R_DATASETS}
                    />
                    {
                        implementationIndexToDuplicate !== null && (
                            <DuplicateImplementationDialog
                                implementation={this.getDuplicateImplementation()}
                                open={implementationIndexToDuplicate !== null}
                                onClose={() => this.setState({ implementationIndexToDuplicate: null })}
                                onDuplicate={(implementation) => this.onAddImplementation(implementation)}
                            />
                        )
                    }
                    <ConfirmationDialog
                        title={translator('datasets.detail.delete_implementation_dialog.title')}
                        text={translator('datasets.detail.delete_implementation_dialog.text')}
                        open={implementationIndexToDelete !== null}
                        onClose={() => this.setState({ implementationIndexToDelete: null })}
                        onConfirm={this.onDeleteImplementation}
                    />
                    <ConfirmationDialog
                        title={translator('datasets.detail.delete_dataset_dialog.title')}
                        text={translator('datasets.detail.delete_dataset_dialog.text')}
                        open={isConfirmDeleteComponentOpen}
                        onClose={() => this.setState({ isConfirmDeleteComponentOpen: false })}
                        onConfirm={this.onDeleteDataset}
                        showLoader={deleteStatus === AsyncStatus.Busy}
                    />
                    <ClosableDialog
                        title={this.isCreateDatasetRoute() ? (
                            translator('datasets.detail.save_dataset_dialog.title_create')
                        ) : translator('datasets.detail.save_dataset_dialog.title_update')}
                        open={isSaveDialogOpen}
                        onClose={() => this.setState({ isSaveDialogOpen: false })}
                    >
                        <Typography>
                            <Translate
                                msg={this.isCreateDatasetRoute() ? (
                                    'datasets.detail.save_dataset_dialog.text_create'
                                ) : (
                                    'datasets.detail.save_dataset_dialog.text_update'
                                )}
                            />
                        </Typography>
                        <Box display="flex" alignItems="center" justifyContent="center" marginTop={2}>
                            <Box paddingLeft={1}>
                                <Button
                                    id="save"
                                    onClick={() => {
                                        if (this.isCreateDatasetRoute()) {
                                            triggerCreateDatasetDetail(newDatasetDetail);
                                        } else {
                                            triggerUpdateDatasetDetail({
                                                ...newDatasetDetail,
                                                uuid: datasetDetail.uuid,
                                            });
                                        }

                                        this.setState({ isSaveDialogOpen: false });
                                    }}
                                    color="secondary"
                                    variant="outlined"
                                    disabled={newDatasetDetail && !checkAuthority(
                                        state,
                                        SECURITY_PRIVILEGES.S_DATASETS_WRITE,
                                        newDatasetDetail.securityGroupName,
                                    )}
                                >
                                    <Translate
                                        msg={this.isCreateDatasetRoute() ? (
                                            'datasets.detail.save_dataset_dialog.save'
                                        ) : (
                                            'datasets.detail.save_dataset_dialog.update'
                                        )}
                                    />
                                </Button>
                            </Box>
                        </Box>
                    </ClosableDialog>
                </>
            );
        }

        private renderDatasetDetailPanel() {
            const { state } = this.props;
            const { newDatasetDetail, requiredFieldsState } = this.state;
            const translator = getTranslator(state);

            return (
                <Box mt={1} display="flex" flexDirection="column" flex="1 1 auto">
                    <Box flex="1 1 auto">
                        <form noValidate autoComplete="off">
                            <TextInput
                                id="dataset-name"
                                label={translator('datasets.detail.side.dataset_name')}
                                InputProps={{
                                    readOnly: !this.isCreateDatasetRoute() && newDatasetDetail !== undefined,
                                    disableUnderline: true,
                                }}
                                value={newDatasetDetail.name}
                                onChange={(e) => this.updateDataset({ name: e.target.value })}
                                required={this.isCreateDatasetRoute()}
                                error={requiredFieldsState.name.showError}
                                helperText={requiredFieldsState.name.showError && 'Dataset name is a required field'}
                            />
                            {
                                this.isCreateDatasetRoute() && (
                                    <TextInput
                                        id="dataset-security-group"
                                        label={translator('datasets.detail.side.dataset_security')}
                                        error={requiredFieldsState.securityGroupName.showError}
                                        // eslint-disable-next-line max-len
                                        helperText={requiredFieldsState.securityGroupName.showError && 'Security group is a required field'}
                                        value={newDatasetDetail && newDatasetDetail.securityGroupName
                                            ? newDatasetDetail.securityGroupName : ''}
                                        onChange={(e) => this.updateDataset({
                                            securityGroupName: e.target.value,
                                        })}
                                        InputProps={{
                                            disableUnderline: true,
                                        }}
                                        required
                                    />
                                )
                            }
                        </form>
                        <DescriptionList
                            noLineAfterListItem
                            items={[].concat(
                                ...(!this.isCreateDatasetRoute()) ? [
                                    {
                                        label: translator('datasets.detail.side.dataset_security'),
                                        value: newDatasetDetail && newDatasetDetail.securityGroupName
                                            ? newDatasetDetail.securityGroupName : '',
                                    },
                                ] : [],
                            )}
                        />
                    </Box>
                </Box>
            );
        }

        private renderDatasetDetailContent() {
            const { newDatasetDetail, hasChangesToCheck } = this.state;
            const { state } = this.props;
            const translator = getTranslator(state);
            const implementations = getParametersFromDatasetDetail(newDatasetDetail);
            const hasImplementations = implementations.length;

            const handleSaveAction = () => {
                const { passed: passedRequired, requiredFieldsState } = requiredFieldsCheck({
                    data: newDatasetDetail,
                    requiredFields: ['name', 'securityGroupName'],
                });

                this.setState({ requiredFieldsState });

                if (passedRequired) {
                    this.setState({ hasChangesToCheck: false, isSaveDialogOpen: true });
                }
            };

            if (!hasImplementations) {
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
                                <Translate msg="datasets.detail.main.no_implementations.title" />
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<Add />}
                                onClick={() => this.setState({ isAddOpen: true })}
                            >
                                <Translate msg="datasets.detail.main.no_implementations.button" />
                            </Button>
                        </Box>
                    </Box>
                );
            }

            const columns: ListColumns<IDatasetImplementationColumn> = {
                labels: {
                    label: <Translate msg="datasets.detail.main.list.labels.labels" />,
                    fixedWidth: '100%',
                },
            };
            return (
                <>
                    <Box>
                        <Collapse in={hasChangesToCheck}>
                            <Box marginX={2} marginBottom={2}>
                                <Alert severity="warning">
                                    <Translate msg="datasets.detail.main.alert.save_changes" />
                                </Alert>
                            </Box>
                        </Collapse>
                        <DetailActions
                            onSave={handleSaveAction}
                            onDelete={() => this.setState({ isConfirmDeleteComponentOpen: true })}
                            onAdd={() => this.setState({ isAddOpen: true })}
                            onExport={() => this.onExportDataset()}
                            isCreateRoute={this.isCreateDatasetRoute()}
                        />
                    </Box>
                    <Box marginY={1}>
                        <GenericList
                            listItems={implementations}
                            columns={columns}
                            listActions={[{
                                icon: <Edit />,
                                label: translator('datasets.detail.main.list.actions.edit'),
                                onClick: (id, index) => this.setState({ implementationIndexToEdit: index }),
                                hideAction: () => null,
                            }, {
                                icon: <Delete />,
                                label: translator('datasets.detail.main.list.actions.delete'),
                                onClick: (id, index) => this.setState({ implementationIndexToDelete: index }),
                                hideAction: () => null,
                            }, {
                                icon: <FileCopy />,
                                label: translator('datasets.detail.main.list.actions.duplicate'),
                                onClick: (id, index) => this.setState({ implementationIndexToDuplicate: index }),
                                hideAction: () => null,
                            }]}
                        />
                    </Box>
                </>
            );
        }

        private renderAddOrEditImplementation() {
            const { newDatasetDetail, implementationIndexToEdit } = this.state;
            return (
                <EditImplementation
                    onClose={() => this.setState({ isAddOpen: false, implementationIndexToEdit: null })}
                    onEdit={(implementation) => {
                        const implementations = implementationIndexToEdit !== null ? (
                            newDatasetDetail.implementations.map((implementationState, index) => {
                                if (index !== implementationIndexToEdit) {
                                    return implementationState;
                                }
                                return implementation;
                            })
                        ) : [...newDatasetDetail.implementations, implementation];
                        this.updateDataset({ implementations });
                    }}
                    implementation={newDatasetDetail.implementations[implementationIndexToEdit]}
                />
            );
        }

        private updateDataset(fieldsToUpdate: Partial<IDatasetBase>) {
            this.setState((prevState) => ({
                newDatasetDetail: {
                    ...prevState.newDatasetDetail,
                    ...fieldsToUpdate,
                },
                hasChangesToCheck: true,
            }));
        }

        private onDeleteDataset() {
            const { state } = this.props;
            const detail = getAsyncDatasetDetail(state).data;
            if (detail) {
                triggerDeleteDatasetDetail({ uuid: detail.uuid });
            }
        }

        private onExportDataset() {
            const { state } = this.props;
            const detail = getAsyncDatasetDetail(state).data;
            if (detail) {
                triggerExportDatasetDetail({ name: detail.name });
            }
        }

        private onAddImplementation(implementation: IDatasetImplementation) {
            const { newDatasetDetail } = this.state;
            this.updateDataset({
                implementations: [...newDatasetDetail.implementations, implementation],
            });
            this.setState({ isAddOpen: false });
        }

        private onDeleteImplementation() {
            const { newDatasetDetail, implementationIndexToDelete } = this.state;
            const newImplementations = [...newDatasetDetail.implementations];

            if (implementationIndexToDelete !== null) {
                newImplementations.splice(implementationIndexToDelete, 1);
                // sync action number with script design number after deleting action
                this.updateDataset({ implementations: newImplementations });
                this.setState({ implementationIndexToDelete: null });
            }
        }

        private getDuplicateImplementation() {
            const { newDatasetDetail, implementationIndexToDuplicate } = this.state;

            if (implementationIndexToDuplicate === null) {
                return null;
            }
            return newDatasetDetail
                && newDatasetDetail.implementations
                && clone(newDatasetDetail.implementations[implementationIndexToDuplicate]);
        }

        private updateDatasetInStateIfNewDatasetWasLoaded(prevProps: TProps & IObserveProps) {
            const datasetDetail = getAsyncDatasetDetail(this.props.state).data;
            const prevDatasetDetail = getAsyncDatasetDetail(prevProps.state).data;

            if (getUniqueIdFromDataset(datasetDetail) !== getUniqueIdFromDataset(prevDatasetDetail)) {
                if (datasetDetail) {
                    triggerFetchDatasetImplementations({ uuid: datasetDetail.uuid });
                }
            } else if (datasetDetail
                && prevDatasetDetail
                && datasetDetail.implementations
                !== prevDatasetDetail.implementations
            ) {
                const datasetDetailDeepClone = clone(datasetDetail);
                this.setState({ newDatasetDetail: datasetDetailDeepClone });
            }
        }

        private navigateToDatasetAfterCreation(prevProps: TProps & IObserveProps) {
            const { newDatasetDetail } = this.state;
            const { status } = getAsyncDatasetDetail(this.props.state).create;
            const { status: prevStatus } = getAsyncDatasetDetail(prevProps.state).create;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                redirectTo({
                    routeKey: ROUTE_KEYS.R_DATASET_DETAIL,
                    params: {
                        name: newDatasetDetail.name,
                    },
                });
            }
        }

        private navigateToDatasetsAfterDeletion(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncDatasetDetail(this.props.state).remove;
            const prevStatus = getAsyncDatasetDetail(prevProps.state).remove.status;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                redirectTo({
                    routeKey: ROUTE_KEYS.R_DATASETS,
                });
            }
        }

        private isCreateDatasetRoute() {
            const currentRouteKey = getRouteKeyByPath({ path: this.props.match.path });
            return currentRouteKey === ROUTE_KEYS.R_DATASET_NEW;
        }
    },
);

function getParametersFromDatasetDetail(dataset: IDatasetBase) {
    const newListItems: IListItem<IDatasetImplementationColumn>[] = dataset && dataset.implementations
        ? dataset.implementations
            .map((implementation, index) => ({
                id: index,
                columns: {
                    labels: implementation.labels.map((label) => label.label).join(', '),
                },
                data: {},
                canBeDeleted: true,
            }))
        : [];

    return newListItems;
}

export default observe([
    StateChangeNotification.I18N_TRANSLATIONS,
    StateChangeNotification.DATA_DATASETS_DETAIL,
    StateChangeNotification.DATA_DATASETS_IMPLEMENTATIONS,
], withRouter(DatasetDetail));
