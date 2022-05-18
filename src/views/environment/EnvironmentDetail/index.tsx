import React from 'react';
import {
    Box,
    Button,
    Collapse,
    createStyles,
    darken,
    Theme,
    Typography,
    withStyles,
    WithStyles,
} from '@material-ui/core';
import { IEnvironment, IEnvironmentParameter } from 'models/state/environments.models';
import { THEME_COLORS } from 'config/themes/colors';
import { IObserveProps, observe } from 'views/observe';
import { IState, StateChangeNotification } from 'models/state.models';
import Loader from 'views/common/waiting/Loader';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { TRequiredFieldsState } from 'models/form.models';
import { getAsyncEnvironmentDetail, getAsyncEnvironments } from 'state/entities/environments/selectors';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { getTranslator } from 'state/i18n/selectors';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel';
import { getRouteKeyByPath, redirectTo, ROUTE_KEYS } from 'views/routes';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import requiredFieldsCheck from 'utils/form/requiredFieldsCheck';
import { IListItem, ListColumns } from 'models/list.models';
import { Edit, Delete } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { clone } from 'lodash';
import TextInput from 'views/common/input/TextInput';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
import GenericList from 'views/common/list/GenericList';
import DetailActions from 'views/connectivity/DetailActions';
import {
    triggerCreateEnvironmentDetail,
    triggerDeleteEnvironmentDetail,
    triggerUpdateEnvironmentDetail } from 'state/entities/environments/triggers';
import { getUniqueIdFromEnvironment } from 'utils/environments/environmentUtils';
import { checkAuthority } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import EditParameter from './EditParameter';

const styles = (({ palette }: Theme) => createStyles({
    addButton: {
        backgroundColor: palette.type === 'light'
            ? THEME_COLORS.GREY_LIGHT
            : darken(THEME_COLORS.GREY_DARK, 0.2),
    },
}));

type TProps = WithStyles<typeof styles>;

interface IComponentState {
    newEnvironmentDetail: IEnvironment;
    environmentIndex: number;
    editParameterIndex: number;
    isAddingParameter: boolean;
    hasChangesToCheck: boolean;
    isSaveDialogOpen: boolean;
    isConfirmDeleteEnvironmentOpen: boolean;
    requiredFieldsState: TRequiredFieldsState<IEnvironment>;
}

const initialEnvironmentDetail: IEnvironment = {
    name: '',
    description: '',
    parameters: [],
};

const EnvironmentDetail = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps & RouteComponentProps, IComponentState> {
        public constructor(props: TProps & IObserveProps & RouteComponentProps) {
            super(props);
            this.state = {
                newEnvironmentDetail: initialEnvironmentDetail,
                environmentIndex: -1,
                editParameterIndex: -1,
                isAddingParameter: false,
                hasChangesToCheck: false,
                isSaveDialogOpen: false,
                isConfirmDeleteEnvironmentOpen: false,
                requiredFieldsState: {
                    name: {
                        showError: false,
                    },
                    description: {
                        showError: false,
                    },
                },
            };

            // eslint-disable-next-line max-len
            this.navigateToComponentAfterCreation = this.navigateToComponentAfterCreation.bind(this);
            this.navigateToEnvironmentAfterDeletion = this.navigateToEnvironmentAfterDeletion.bind(this);
            this.renderEnvironmentDetailPanel = this.renderEnvironmentDetailPanel.bind(this);
            this.renderEditParameterContent = this.renderEditParameterContent.bind(this);
            this.renderEnvironmentDetailContent = this.renderEnvironmentDetailContent.bind(this);
            this.onDeleteEnvironment = this.onDeleteEnvironment.bind(this);
            this.isCreateEnvironmentRoute = this.isCreateEnvironmentRoute.bind(this);
            this.getEditParameter = this.getEditParameter.bind(this);
            this.updateEnvInStateIfNewEnvironmentWasLoaded = this.updateEnvInStateIfNewEnvironmentWasLoaded.bind(this);
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            this.updateEnvInStateIfNewEnvironmentWasLoaded(prevProps);
            this.navigateToComponentAfterCreation(prevProps);
            this.navigateToEnvironmentAfterDeletion(prevProps);
        }

        public render() {
            const {
                newEnvironmentDetail,
                isAddingParameter,
                isConfirmDeleteEnvironmentOpen,
                isSaveDialogOpen,
            } = this.state;
            const { state } = this.props;
            const environmentDetailAsyncStatus = getAsyncEnvironmentDetail(state).fetch.status;
            const environmentAsyncStatus = getAsyncEnvironments(state).fetch.status;
            const deleteStatus = getAsyncEnvironmentDetail(state).remove.status;
            const parameter = this.getEditParameter();
            const translator = getTranslator(state);
            return (
                <>
                    <Loader
                        show={
                            environmentDetailAsyncStatus === AsyncStatus.Busy
                            || environmentAsyncStatus === AsyncStatus.Busy
                        }
                    />
                    <ContentWithSidePanel
                        panel={this.renderEnvironmentDetailPanel()}
                        content={this.renderEnvironmentDetailContent()}
                        goBackTo={ROUTE_KEYS.R_ENVIRONMENTS}
                        contentOverlay={(parameter || isAddingParameter) && (
                            this.renderEditParameterContent()
                        )}
                        contentOverlayOpen={!!(isAddingParameter || parameter)}
                        toggleLabel={<Translate msg="environments.detail.side.toggle_button" />}
                    />
                    <ConfirmationDialog
                        title={translator('environments.detail.delete_environment_dialog.title')}
                        text={translator('environments.detail.delete_environment_dialog.text')}
                        open={isConfirmDeleteEnvironmentOpen}
                        onClose={() => this.setState({ isConfirmDeleteEnvironmentOpen: false })}
                        onConfirm={this.onDeleteEnvironment}
                        showLoader={deleteStatus === AsyncStatus.Busy}
                    />
                    <ClosableDialog
                        title={translator('environments.detail.save_environment_dialog.title')}
                        open={isSaveDialogOpen}
                        onClose={() => this.setState({ isSaveDialogOpen: false })}
                    >
                        <Typography>
                            <Translate
                                msg="environments.detail.save_environment_dialog.text"
                                placeholders={{
                                    environmentName: newEnvironmentDetail.name,
                                }}
                            />
                        </Typography>
                        <Box display="flex" alignItems="center" justifyContent="center" marginTop={2}>
                            <Box paddingRight={1}>
                                <Button
                                    id="save-update-environment"
                                    onClick={() => {
                                        if (this.isCreateEnvironmentRoute()) {
                                            triggerCreateEnvironmentDetail(newEnvironmentDetail);
                                        } else {
                                            triggerUpdateEnvironmentDetail(newEnvironmentDetail);
                                        }
                                        this.setState({ isSaveDialogOpen: false });
                                    }}
                                    variant="contained"
                                    color="secondary"
                                >
                                    {
                                        this.isCreateEnvironmentRoute() ? (
                                            <Translate msg="environments.detail.save_environment_dialog.create" />
                                        ) : (
                                            <Translate msg="environments.detail.save_environment_dialog.update" />
                                        )
                                    }
                                </Button>
                            </Box>
                        </Box>
                    </ClosableDialog>
                </>
            );
        }

        private renderEnvironmentDetailPanel() {
            const { state } = this.props;
            const { newEnvironmentDetail, requiredFieldsState } = this.state;
            const translator = getTranslator(state);
            return (
                <Box mt={1} display="flex" flexDirection="column" flex="1 1 auto">
                    <Box flex="1 1 auto">
                        <form noValidate autoComplete="off">
                            <TextInput
                                id="environment-name"
                                label={translator('environments.detail.side.environment_name')}
                                InputProps={{
                                    readOnly: !this.isCreateEnvironmentRoute() && newEnvironmentDetail !== undefined,
                                    disableUnderline: true,
                                }}
                                value={newEnvironmentDetail.name}
                                onChange={(e) => this.updateEnvironment({ name: e.target.value })}
                                required={this.isCreateEnvironmentRoute()}
                                error={requiredFieldsState.name.showError}
                                helperText={requiredFieldsState.name.showError
                                    && 'Environment name is a required field'}
                            />
                            <TextInput
                                id="environment-description"
                                label={translator('environments.detail.side.environment_description')}
                                InputProps={{
                                    readOnly: !this.isCreateEnvironmentRoute() && newEnvironmentDetail !== undefined,
                                    disableUnderline: true,
                                }}
                                value={newEnvironmentDetail.description}
                                onChange={(e) => this.updateEnvironment({ description: e.target.value })}
                                required={this.isCreateEnvironmentRoute()}
                                error={requiredFieldsState.description.showError}
                                helperText={requiredFieldsState.description.showError
                                    && 'Environment description is a required field'}
                            />
                        </form>
                    </Box>
                </Box>
            );
        }

        private renderEnvironmentDetailContent() {
            const {
                newEnvironmentDetail,
                hasChangesToCheck,
            } = this.state;
            const { state } = this.props;
            const translator = getTranslator(state);
            const parameterItems = getParametersFromEnvironment(newEnvironmentDetail);
            const hasParameters = parameterItems.length > 0;

            const handleSaveAction = () => {
                const { passed: passedRequired, requiredFieldsState } = requiredFieldsCheck({
                    data: newEnvironmentDetail,
                    requiredFields: ['name', 'description'],
                });

                if (passedRequired) {
                    this.setState({
                        isSaveDialogOpen: true,
                        requiredFieldsState,
                        hasChangesToCheck: false,
                    });
                } else {
                    this.setState({
                        requiredFieldsState,
                    });
                }
            };

            const parameterColumns: ListColumns<IEnvironmentParameter> = {
                name: {
                    label: <Translate msg="environments.detail.main.list.labels.name" />,
                    fixedWidth: '40%',
                },
                value: {
                    label: <Translate msg="environments.detail.main.list.labels.value" />,
                    fixedWidth: '60%',
                },
            };

            if (!hasParameters) {
                return (
                    <>
                        <Box>
                            <Collapse in={hasChangesToCheck}>
                                <Box marginX={2} marginBottom={2}>
                                    <Alert severity="warning">
                                        <Translate msg="environments.detail.main.alert.save_changes" />
                                    </Alert>
                                </Box>
                            </Collapse>
                            <DetailActions
                                onSave={handleSaveAction}
                                onDelete={() => this.setState({ isConfirmDeleteEnvironmentOpen: true })}
                                onAdd={() => {
                                    this.setState({ isAddingParameter: true });
                                }}
                                isCreateRoute={this.isCreateEnvironmentRoute()}
                            />
                        </Box>
                    </>
                );
            }

            return (
                <>
                    <Box>
                        <Collapse in={hasChangesToCheck}>
                            <Box marginX={2} marginBottom={2}>
                                <Alert severity="warning">
                                    <Translate msg="environments.detail.main.alert.save_changes" />
                                </Alert>
                            </Box>
                        </Collapse>
                        <DetailActions
                            onSave={handleSaveAction}
                            onDelete={() => this.setState({ isConfirmDeleteEnvironmentOpen: true })}
                            onAdd={() => {
                                this.setState({ isAddingParameter: true });
                            }}
                            isCreateRoute={this.isCreateEnvironmentRoute()}
                        />
                    </Box>
                    <Box marginY={1}>
                        <GenericList
                            listItems={parameterItems}
                            columns={parameterColumns}
                            listActions={[{
                                icon: <Edit />,
                                label: translator('environments.detail.main.list.actions.edit'),
                                onClick: (_, index) => this.setState({ editParameterIndex: index }),
                                hideAction: () =>
                                    !checkAuthority(state, SECURITY_PRIVILEGES.S_ENVIRONMENTS_WRITE),
                            }, {
                                icon: <Delete />,
                                label: translator('environments.detail.main.list.actions.delete'),
                                onClick: (_, index) => {
                                    if (newEnvironmentDetail.parameters.length > 0) {
                                        const newParameters = [...newEnvironmentDetail.parameters];
                                        newParameters.splice(index, 1);
                                        this.updateEnvironment({
                                            parameters: newParameters,
                                        });
                                    }
                                },
                                hideAction: () =>
                                    !checkAuthority(
                                        state,
                                        SECURITY_PRIVILEGES.S_ENVIRONMENTS_WRITE,
                                    ),
                            }]}
                        />
                    </Box>
                </>
            );
        }

        private renderEditParameterContent() {
            const {
                newEnvironmentDetail,
                editParameterIndex,
                isAddingParameter,
            } = this.state;
            const { state } = this.props;
            const parameter = editParameterIndex > -1 ? this.getEditParameter() : {
                name: '',
                value: '',
            };
            const matchingEnvironment = matchEnvironment(state, newEnvironmentDetail);
            const mandatory = matchingEnvironment
                ? matchingEnvironment.parameters
                    .some((item) => item.name === parameter.name && item.mandatory)
                : false;
            return (
                <EditParameter
                    onClose={() => this.setState({ editParameterIndex: -1, isAddingParameter: false })}
                    parameter={parameter}
                    mandatory={mandatory}
                    isCreateParameter={isAddingParameter}
                    onEdit={(newParameter) => {
                        const newParameters = isAddingParameter
                            ? [...newEnvironmentDetail.parameters, newParameter] : [...newEnvironmentDetail.parameters];
                        if (!isAddingParameter) {
                            newParameters[editParameterIndex] = newParameter;
                        }
                        const orderedParameters = orderEnvironmentParameters(newParameters, matchingEnvironment);
                        this.updateEnvironment({
                            parameters: orderedParameters,
                        });
                    }}
                />
            );
        }

        private updateEnvInStateIfNewEnvironmentWasLoaded(prevProps: TProps & IObserveProps) {
            const environmentDetail = getAsyncEnvironmentDetail(this.props.state).data;
            const prevEnvironmentDetail = getAsyncEnvironmentDetail(prevProps.state).data;
            if (getUniqueIdFromEnvironment(environmentDetail) !== getUniqueIdFromEnvironment(prevEnvironmentDetail)) {
                const environmentDetailDeepClone = clone(environmentDetail);
                if (environmentDetailDeepClone) {
                    this.setState({
                        newEnvironmentDetail: environmentDetailDeepClone,
                    });
                }
            }
        }

        private updateEnvironment(fieldsToUpdate: Partial<IEnvironment>) {
            this.setState((prevState) => ({
                newEnvironmentDetail: {
                    ...prevState.newEnvironmentDetail,
                    ...fieldsToUpdate,
                },
                hasChangesToCheck: true,
            }));
        }

        private onDeleteEnvironment() {
            const { state } = this.props;
            const detail = getAsyncEnvironmentDetail(state).data;
            if (detail) {
                triggerDeleteEnvironmentDetail({ name: detail.name });
            }
        }

        private navigateToComponentAfterCreation(prevProps: TProps & IObserveProps) {
            const { newEnvironmentDetail } = this.state;
            const { status } = getAsyncEnvironmentDetail(this.props.state).create;
            const prevStatus = getAsyncEnvironmentDetail(prevProps.state).create.status;
            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                redirectTo({
                    routeKey: ROUTE_KEYS.R_ENVIRONMENT_DETAIL,
                    params: {
                        name: newEnvironmentDetail.name,
                    },
                });
            }
        }

        private navigateToEnvironmentAfterDeletion(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncEnvironmentDetail(this.props.state).remove;
            const prevStatus = getAsyncEnvironmentDetail(prevProps.state).remove.status;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                redirectTo({
                    routeKey: ROUTE_KEYS.R_ENVIRONMENTS,
                });
            }
        }

        private getEditParameter() {
            const { newEnvironmentDetail, editParameterIndex } = this.state;
            if (editParameterIndex === -1) {
                return null;
            }
            return newEnvironmentDetail
                && newEnvironmentDetail.parameters
                && clone(newEnvironmentDetail.parameters[editParameterIndex]);
        }

        private isCreateEnvironmentRoute() {
            const currentRouteKey = getRouteKeyByPath({ path: this.props.match.path });
            return currentRouteKey === ROUTE_KEYS.R_ENVIRONMENT_NEW;
        }
    },
);

function getParametersFromEnvironment(environments: IEnvironment) {
    const allParameters = environments.parameters;

    const newListItems: IListItem<IEnvironmentParameter>[] = allParameters.map((parameter, index) => ({
        id: index,
        columns: {
            name: parameter.name,
            value: parameter.value,
        },
        data: {
            name: parameter.name,
            value: parameter.value,
        },
    }));

    return newListItems;
}

function orderEnvironmentParameters(items: IEnvironmentParameter[], environment: IEnvironment) {
    const parameters = items
        ? items
            .map((parameter) => ({
                name: parameter.name,
                value: parameter.value,
                mandatory: environment
                    ? environment.parameters
                        .some((type) => type.name === parameter.name)
                    : false,
            }))
        : [];
    const mandatoryParameters = parameters
        .filter((p) => p.mandatory)
        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name));
    const nonMandatoryParameters = parameters
        .filter((p) => !p.mandatory)
        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name));
    const orderedParameters: IEnvironmentParameter[] = mandatoryParameters
        .concat(nonMandatoryParameters)
        .map((p) => ({
            name: p.name,
            value: p.value,
        }));
    return orderedParameters;
}

function matchEnvironment(state: IState, env: IEnvironment) {
    const environment = getAsyncEnvironments(state).data.environments || [];
    const matchingEnvironment = environment
        .find((item) => item.name === env?.name);
    return matchingEnvironment;
}

export default observe([
    StateChangeNotification.ENVIRONMENT_DETAIL,
], withRouter(EnvironmentDetail));
