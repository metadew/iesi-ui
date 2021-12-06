import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { clone } from 'ramda';
import { getUniqueIdFromDataset } from 'utils/datasets/datasetUtils';
import { IObserveProps, observe } from 'views/observe';
import { Box, Collapse, createStyles, Typography, WithStyles, withStyles, Button } from '@material-ui/core';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel';
import { IDatasetBase, IDatasetImplementationColumn } from 'models/state/datasets.model';
import TextInput from 'views/common/input/TextInput';
import { getTranslator } from 'state/i18n/selectors';
import { getRouteKeyByPath, ROUTE_KEYS } from 'views/routes';
import { TRequiredFieldsState } from 'models/form.models';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { Alert } from '@material-ui/lab';
import DetailActions from 'views/design/ScriptDetail/DetailActions';
import GenericList from 'views/common/list/GenericList';
import { IListItem, ListColumns } from 'models/list.models';
import { Add, Edit } from '@material-ui/icons';
import { getAsyncDatasetDetail } from 'state/entities/datasets/selectors';
import { triggerCreateDatasetDetail } from 'state/entities/datasets/triggers';
import { checkAuthority } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import requiredFieldsCheck from 'utils/form/requiredFieldsCheck';
import { StateChangeNotification } from 'models/state.models';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import EditImplementation from './EditImplementation';

const styles = () => createStyles({});

type TProps = WithStyles<typeof styles>;

interface IComponentState {
    newDatasetDetail: IDatasetBase;
    hasChangesToCheck: boolean;
    isAddOpen: boolean;
    isSaveDialogOpen: boolean;
    requiredFieldsState: TRequiredFieldsState<IDatasetBase>;
}

const initialDatasetDetail: IDatasetBase = {
    name: '',
    securityGroupName: 'PUBLIC',
    implementations: [],
};

const DatasetDetail = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps & RouteComponentProps, IComponentState> {
        public constructor(props: TProps & IObserveProps & RouteComponentProps) {
            super(props);
            this.state = {
                newDatasetDetail: initialDatasetDetail,
                hasChangesToCheck: false,
                isAddOpen: false,
                isSaveDialogOpen: false,
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

            this.updateDatasetInStateIfNewDatasetWasLoaded = this.updateDatasetInStateIfNewDatasetWasLoaded.bind(this);
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            this.updateDatasetInStateIfNewDatasetWasLoaded(prevProps);
        }

        public render() {
            const { state } = this.props;
            const { newDatasetDetail, isAddOpen, isSaveDialogOpen } = this.state;
            const translator = getTranslator(state);
            console.log('DATASET DETAIL :', newDatasetDetail);
            return (
                <>
                    <ContentWithSidePanel
                        panel={this.renderDatasetDetailPanel()}
                        content={this.renderDatasetDetailContent()}
                        contentOverlay={this.renderAddOrEditImplementation()}
                        contentOverlayOpen={isAddOpen}
                        toggleLabel={<Translate msg="datasets.detail.side.toggle_button" />}
                    />
                    <ClosableDialog
                        title={translator('datasets.detail.save_script_dialog.title')}
                        open={isSaveDialogOpen}
                        onClose={() => this.setState({ isSaveDialogOpen: false })}
                    >
                        <Typography>
                            <Translate msg="datasets.detail.save_script_dialog.text" />
                        </Typography>
                        <Box display="flex" alignItems="center" justifyContent="space-between" marginTop={2}>
                            <Box paddingLeft={1}>
                                <Button
                                    id="save"
                                    onClick={() => {
                                        triggerCreateDatasetDetail(newDatasetDetail);
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
                                    <Translate msg="scripts.detail.save_script_dialog.save" />
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
                        </form>
                    </Box>
                </Box>
            );
        }

        private renderDatasetDetailContent() {
            const { newDatasetDetail, hasChangesToCheck } = this.state;
            const { state } = this.props;
            const translator = getTranslator(state);
            const implementations = getParametersFromDatasetDetails(newDatasetDetail);
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
                            onDelete={null}
                            onAdd={null}
                            isCreateRoute={this.isCreateDatasetRoute()}
                        />
                    </Box>
                    <Box marginY={1}>
                        <GenericList
                            listItems={implementations}
                            columns={columns}
                            listActions={[{
                                icon: <Edit />,
                                label: translator('components.detail.main.list.actions.edit'),
                                onClick: () => null,
                                hideAction: () => null,
                            }]}
                        />
                    </Box>
                </>
            );
        }

        private renderAddOrEditImplementation() {
            return (
                <EditImplementation
                    onClose={() => this.setState({ isAddOpen: false })}
                    onEdit={(implementation) => {
                        this.setState((prevState) => ({
                            newDatasetDetail: {
                                ...prevState.newDatasetDetail,
                                implementations: [...prevState.newDatasetDetail.implementations, implementation],
                            },
                            isAddOpen: false,
                        }));
                    }}
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

        private updateDatasetInStateIfNewDatasetWasLoaded(prevProps: TProps & IObserveProps) {
            const datasetDetail = getAsyncDatasetDetail(this.props.state).data;
            const prevDatasetDetail = getAsyncDatasetDetail(prevProps.state).data;

            if (getUniqueIdFromDataset(datasetDetail) !== getUniqueIdFromDataset(prevDatasetDetail)) {
                const datasetDetailDeepClone = clone(datasetDetail);
                this.setState({ newDatasetDetail: datasetDetailDeepClone });
            }
        }

        private isCreateDatasetRoute() {
            const currentRouteKey = getRouteKeyByPath({ path: this.props.match.path });
            console.log('ROUTE KEY : ', currentRouteKey);
            return currentRouteKey === ROUTE_KEYS.R_DATASET_NEW;
        }
    },
);

function getParametersFromDatasetDetails(detail: IDatasetBase) {
    const newListItems: IListItem<IDatasetImplementationColumn>[] = detail
        ? detail.implementations
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
], withRouter(DatasetDetail));
