import React from 'react';
import {
    Box,
    Button,
    Collapse,
    // Box,
    // Button,
    // Collapse,
    createStyles,
    darken,
    Theme,
    Typography,
    // Typography,
    withStyles,
    WithStyles,
} from '@material-ui/core';
import { IEnvironment } from 'models/state/environments.models';
import { THEME_COLORS } from 'config/themes/colors';
import { IObserveProps, observe } from 'views/observe';
// import { getAsyncConnectionDetail } from 'state/entities/connections/selectors';
import { StateChangeNotification } from 'models/state.models';
// import { getUniqueIdFromConnection } from 'utils/connections/connectionUtils';
// import { clone } from 'lodash';
import Loader from 'views/common/waiting/Loader';
// import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
// import { getAsyncConnectionTypes } from 'state/entities/constants/selectors';
import { withRouter, RouteComponentProps } from 'react-router-dom';
// import { getRouteKeyByPath, redirectTo, ROUTE_KEYS } from 'views/routes';
// import { Alert, Autocomplete } from '@material-ui/lab';
// import { IConnectionType } from 'models/state/constants.models';
// import { IListItem, ListColumns } from 'models/list.models';
// import { checkAuthority, checkAuthorityGeneral } from 'state/auth/selectors';
// import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
// import requiredFieldsCheck from 'utils/form/requiredFieldsCheck';
// import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
// import ClosableDialog from 'views/common/layout/ClosableDialog';
// import TextInput from 'views/common/input/TextInput';
import { TRequiredFieldsState } from 'models/form.models';
import { getAsyncEnvironmentDetail, getAsyncEnvironments } from 'state/entities/environments/selectors';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { getTranslator } from 'state/i18n/selectors';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel';
import { getRouteKeyByPath, ROUTE_KEYS } from 'views/routes';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import requiredFieldsCheck from 'utils/form/requiredFieldsCheck';
import { IParameter } from 'models/state/iesiGeneric.models';
import { IListItem, ListColumns } from 'models/list.models';
import { Edit, Delete } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { clone } from 'lodash';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import { checkAuthority } from 'state/auth/selectors';
import TextInput from 'views/common/input/TextInput';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
import GenericList from 'views/common/list/GenericList';
import DetailActions from 'views/connectivity/DetailActions';
import {
    triggerCreateEnvironmentDetail,
    triggerDeleteEnvironmentDetail,
    triggerUpdateEnvironmentDetail } from 'state/entities/environments/triggers';
import { IConnectionParameter } from 'models/state/connections.model';
import EditParameter from 'views/connectivity/EditParameter';
// import GenericList from 'views/common/list/GenericList';
// import { Delete, Edit } from '@material-ui/icons';
// import DescriptionList from 'views/common/list/DescriptionList';
// import {
//     triggerCreateEnvironmentDetail,
//     triggerDeleteEnvironmentDetail,
//     triggerUpdateEnvironmentDetail,
// } from 'state/entities/environments/triggers';

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
            // this.updateConnectionInStateIfNewConnectionWasLoaded = this.updateConnectionInStateIfNewConnectionWasLoaded.bind(this);
            // this.navigateToComponentAfterCreation = this.navigateToComponentAfterCreation.bind(this);
            // this.navigateToConnectionAfterDeletion = this.navigateToConnectionAfterDeletion.bind(this);
            this.renderEnvironmentDetailPanel = this.renderEnvironmentDetailPanel.bind(this);
            this.renderEditParameterContent = this.renderEditParameterContent.bind(this);
            this.renderEnvironmentDetailContent = this.renderEnvironmentDetailContent.bind(this);
            this.onDeleteEnvironment = this.onDeleteEnvironment.bind(this);
            this.isCreateEnvironmentRoute = this.isCreateEnvironmentRoute.bind(this);
            this.getEditParameter = this.getEditParameter.bind(this);
        }

        // public componentDidUpdate(prevProps: TProps & IObserveProps) {
        //     this.updateConnectionInStateIfNewConnectionWasLoaded(prevProps);
        //     this.navigateToComponentAfterCreation(prevProps);
        //     this.navigateToConnectionAfterDeletion(prevProps);
        // }

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
                            {
                                checkAuthority(
                                    state,
                                    SECURITY_PRIVILEGES.S_ENVIRONMENTS_WRITE,
                                    newEnvironmentDetail.description,
                                )
                                    ? (
                                        <Translate
                                            msg="environments.detail.save_environment_dialog.text"
                                            placeholders={{
                                                environmentName: newEnvironmentDetail.name,
                                            }}
                                        />
                                    ) : (
                                        <Translate
                                            msg="environments.detail.save_environment_dialog.text_description"
                                            placeholders={{
                                                description: newEnvironmentDetail.description,
                                            }}
                                        />
                                    )
                            }
                        </Typography>
                        <Box display="flex" alignItems="center" justifyContent="center" marginTop={2}>
                            <Box paddingRight={1}>
                                <Button
                                    id="save-update-connection"
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
                                    // disabled={!checkAuthority(
                                    //     state,
                                    //     SECURITY_PRIVILEGES.S_ENVIRONMENTS_WRITE,
                                    // )}

                                >
                                    {
                                        this.isCreateEnvironmentRoute() ? (
                                            <Translate msg="connections.detail.save_connection_dialog.create" />
                                        ) : (
                                            <Translate msg="connections.detail.save_connection_dialog.update" />
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
            const {
                newEnvironmentDetail,
                // environmentIndex,
                requiredFieldsState,
            } = this.state;
            const { state } = this.props;
            const translator = getTranslator(state);
            // const environments = getAsyncEnvironments(state).data.environments || [];
            return (
                <Box mt={1} display="flex" flexDirection="column" flex="1 1 auto">
                    <Box flex="1 1 auto">
                        <form noValidate autoComplete="off">
                            {/* <Autocomplete
                                id="combo-box-connection-types"
                                options={connectionTypeListItems}
                                value={autoComplete || null}
                                getOptionLabel={(option) => option.data.type}
                                getOptionDisabled={() =>
                                    !checkAuthorityGeneral(
                                        state,
                                        SECURITY_PRIVILEGES.S_ENVIRONMENTS_WRITE,
                                    )}
                                renderInput={(params) => (
                                    <TextInput
                                        {...params}
                                        label={translator('environments.detail.side.connection_type')}
                                        variant="filled"
                                        error={requiredFieldsState.type.showError}
                                        // eslint-disable-next-line max-len
                                        helperText={requiredFieldsState.type.showError &&
                                            'Connection type is a required field'}
                                        InputProps={{
                                            ...params.InputProps,
                                            readOnly: !this.isCreateConnectionRoute() && !checkAuthority(
                                                state,
                                                SECURITY_PRIVILEGES.S_ENVIRONMENTS_WRITE,
                                            ),
                                            disableUnderline: true,
                                        }}
                                    />
                                )}
                                onChange={(
                                    e: React.ChangeEvent<{}>,
                                    newValue: IListItem<IConnectionTypeColumnNames, IListData>,
                                ) => {
                                    this.updateConnection({
                                        type: newValue ? newValue.data.type : null,
                                        environments: newEnvironmentDetail.environments
                                            .map((environment) => (
                                                {
                                                    ...environment,
                                                    parameters: newValue
                                                        ? environments
                                                            .find((item) => item.type === newValue?.data?.type)
                                                            .parameters?.filter((item) => item.mandatory)
                                                            .map((item) => ({ name: item.name, value: '' }))
                                                        : [],

                                                }
                                            )),
                                    });
                                }}
                            /> */}
                            <TextInput
                                id="environment-name"
                                label={translator('environments.detail.side.environment_name')}
                                InputProps={{
                                    readOnly: !this.isCreateEnvironmentRoute() && newEnvironmentDetail !== undefined,
                                    //    && !checkAuthorityGeneral(state, SECURITY_PRIVILEGES.S_CONNECTIONS_WRITE),
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
                                multiline
                                rows={8}
                                InputProps={{
                                    readOnly: (!this.isCreateEnvironmentRoute && newEnvironmentDetail !== undefined),
                                    // || !checkAuthority(
                                    //     state,
                                    //     SECURITY_PRIVILEGES.S_ENVIRONMENTS_WRITE,
                                    // ),
                                    disableUnderline: true,

                                }}
                                value={newEnvironmentDetail.description}
                                onChange={(e) => this.updateEnvironment({
                                    description: e.target.value,
                                })}
                            />
                            {
                                /*
                            {
                                this.isCreateConnectionRoute() ? (
                                    <>
                                        <TextInput
                                            id="connection-security-group"
                                            label={translator('connections.detail.side.connection_security')}
                                            error={requiredFieldsState.securityGroupName.showError}
                                            // eslint-disable-next-line max-len
                                            helperText={requiredFieldsState.securityGroupName.showError
                                                && 'Security group is a required field'}
                                            value={newConnectionDetail && newConnectionDetail.securityGroupName
                                                ? newConnectionDetail.securityGroupName : ''}
                                            onChange={(e) => this.updateConnection({
                                                securityGroupName: e.target.value,
                                            })}
                                            InputProps={{
                                                disableUnderline: true,
                                            }}
                                            required
                                        />
                                        <DescriptionList
                                            noLineAfterListItem
                                            items={[].concat({
                                                label: <Translate msg="connections.detail.side.environments.title" />,
                                                value: <EditEnvironments
                                                    // eslint-disable-next-line max-len
                                                    environments={newConnectionDetail &&
                                                        newConnectionDetail.environments}
                                                    selectedIndex={environmentIndex}
                                                    onEnvironmentSelected={(index) =>
                                                        this.setState({ environmentIndex: index })}
                                                    onSubmit={(newEnvironment) => {
                                                        this.updateConnection({
                                                            environments: [...newConnectionDetail.environments, {
                                                                ...newEnvironment,
                                                                parameters: newConnectionDetail.type
                                                                    ? connectionTypes
                                                                        // eslint-disable-next-line max-len
                                                                        .find((item) => item.type
                                                                        === newConnectionDetail.type)
                                                                        .parameters?.filter((item) => item.mandatory)
                                                                        .map((item) => ({ name: item.name, value: '' }))
                                                                    : [],
                                                            }],
                                                        });
                                                    }}
                                                    onDelete={(index) => {
                                                        const environments = [...newConnectionDetail.environments];
                                                        environments.splice(index, 1);
                                                        this.updateConnection({
                                                            environments,
                                                        });
                                                    }}
                                                    isCreateConnectionRoute={this.isCreateConnectionRoute()}
                                                />,
                                            })}
                                        />
                                    </>
                                ) : (
                                    <DescriptionList
                                        noLineAfterListItem
                                        items={[].concat({
                                            label: translator('connections.detail.side.connection_security'),
                                            value: newConnectionDetail && newConnectionDetail.securityGroupName
                                                ? newConnectionDetail.securityGroupName : '',
                                        }, {
                                            label: <Translate msg="connections.detail.side.environments.title" />,
                                            value: <EditEnvironments
                                                environments={newConnectionDetail && newConnectionDetail.environments}
                                                selectedIndex={environmentIndex}
                                                // eslint-disable-next-line max-len
                                                onEnvironmentSelected={(index) =>
                                                    this.setState({ environmentIndex: index })}
                                                onSubmit={(newEnvironment) => {
                                                    this.updateConnection({
                                                        environments: [...newConnectionDetail.environments, {
                                                            ...newEnvironment,
                                                            parameters: newConnectionDetail.type
                                                                ? connectionTypes
                                                                    // eslint-disable-next-line max-len
                                                                    .find((item) => item.type ===
                                                                    newConnectionDetail.type)
                                                                    .parameters?.filter((item) => item.mandatory)
                                                                    .map((item) => ({ name: item.name, value: '' }))
                                                                : [],
                                                        }],
                                                    });
                                                }}
                                                onDelete={(index) => {
                                                    const environments = [...newConnectionDetail.environments];
                                                    environments.splice(index, 1);
                                                    this.updateConnection({
                                                        environments,
                                                    });
                                                }}
                                                isCreateConnectionRoute={this.isCreateConnectionRoute()}
                                            />,
                                        })}
                                    />
                                )
                            } */}
                        </form>
                    </Box>
                </Box>
            );
        }

        private renderEnvironmentDetailContent() {
            const {
                newEnvironmentDetail,
                // environmentIndex,
                hasChangesToCheck,
            } = this.state;
            const { state } = this.props;
            const translator = getTranslator(state);
            const environments = getAsyncEnvironments(state).data.environments || [];
            const matchingEnvironment = environments.find((item) => item.name === newEnvironmentDetail.name);
            const parameterItems = getParametersFromEnvironment(
                newEnvironmentDetail,
                matchingEnvironment,
            );
            // const hasParameters = parameterItems.length > 0;

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

            const parameterColumns: ListColumns<IParameter> = {
                name: {
                    label: <Translate msg="environments.detail.main.list.labels.name" />,
                    fixedWidth: '40%',
                },
                value: {
                    label: <Translate msg="environments.detail.main.list.labels.value" />,
                    fixedWidth: '60%',
                },
            };

            // if (!hasParameters) {
            //     return (
            //         <Box
            //             display="flex"
            //             flexDirection="column"
            //             flex="1 1 auto"
            //             justifyContent="center"
            //             paddingBottom={5}
            //         >
            //             <Box textAlign="center">
            //                 <Typography variant="h2" paragraph>
            //                     <Translate msg="connections.detail.main.no_parameters.title" />
            //                 </Typography>
            //             </Box>
            //         </Box>
            //     );
            // }

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
                            // onDelete={() => this.setState({ isConfirmDeleteConnectionOpen: true })}
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
                                onClick: (_, index) => {
                                    this.setState({ editParameterIndex: index });
                                },
                                hideAction: (item) => ((
                                    !this.isCreateEnvironmentRoute() && !checkAuthority(
                                        state,
                                        SECURITY_PRIVILEGES.S_ENVIRONMENTS_WRITE,
                                        item.data.securityGroupName,
                                    )
                                ) || !item.canBeDeleted
                                ),
                            }, {
                                icon: <Delete />,
                                label: translator('environments.detail.main.list.actions.delete'),
                                onClick: (_, index) => {
                                    const newParameters = [
                                        ...newEnvironmentDetail.parameters,
                                    ];
                                    newParameters.splice(index, 1);
                                    // this.updateEnvironment({
                                    //     environments: newEnvironmentDetail.environments
                                    //         .map((environment, envIndex) => (
                                    //             envIndex === environmentIndex
                                    //                 ? { ...environment, parameters: newParameters }
                                    //                 : environment
                                    //         )),
                                    // });
                                },
                                hideAction: (item) => ((
                                    !this.isCreateEnvironmentRoute() && !checkAuthority(
                                        state,
                                        SECURITY_PRIVILEGES.S_ENVIRONMENTS_WRITE,
                                        item.data.securityGroupName,
                                    )
                                ) || !item.canBeDeleted
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
                // environmentIndex,
                editParameterIndex,
                isAddingParameter,
            } = this.state;
            const { state } = this.props;
            // if editing, get current parameters else (adding new parameter) create an empty parameter
            const parameter = editParameterIndex > -1 ? this.getEditParameter() : {
                name: '',
                value: '',
            };

            const environments = getAsyncEnvironments(state).data.environments || [];
            const matchingEnvironment = environments
                .find((item) => item.name === newEnvironmentDetail?.name);
            const mandatory = matchingEnvironment
                ? matchingEnvironment.parameters
                    .some((item) => item.name === parameter.name && item.value)
                : false;
            return (
                <EditParameter
                    onClose={() => this.setState({ editParameterIndex: -1, isAddingParameter: false })}
                    parameter={parameter}
                    mandatory={mandatory}
                    isCreateParameter={isAddingParameter}
                    onEdit={(newParameter) => {
                        let newParameters: IParameter[];
                        if (isAddingParameter) {
                            newParameters = [
                                ...newEnvironmentDetail.parameters, newParameter,
                            ];
                        } else {
                            newParameters = [...newEnvironmentDetail.parameters];
                            newParameters[editParameterIndex] = newParameter;
                        }

                        // const orderedEnvironments = orderEnvironments(
                        //     newEnvironmentDetail, matchingEnvironment,
                        //     newParameters,
                        //     newEnvironmentDetail.environments[environmentIndex],
                        // );
                        // this.updateConnection({
                        //     environments: orderedEnvironments,
                        // });
                    }}
                />
            );
        }

        // private updateConnectionInStateIfNewConnectionWasLoaded(prevProps: TProps & IObserveProps) {
        //     const connectionDetail = getAsyncConnectionDetail(this.props.state).data;
        //     const prevConnectionDetail = getAsyncConnectionDetail(prevProps.state).data;
        //     if (getUniqueIdFromConnection(connectionDetail) !== getUniqueIdFromConnection(prevConnectionDetail)) {
        //         const connectionDetailDeepClone = clone(connectionDetail);
        //         if (connectionDetailDeepClone) {
        //             const connectionTypes = getAsyncConnectionTypes(this.props.state).data || [];
        //             const matchingConnectionType = connectionTypes
        //                 .find((item) => item.type === connectionDetailDeepClone.type);
        //             const orderedEnvironments = orderEnvironments(
        //                 connectionDetailDeepClone, matchingConnectionType,
        //             );
        //             this.setState({
        //                 newConnectionDetail: {
        //                     ...connectionDetailDeepClone,
        //                     environments: orderedEnvironments,
        //                 },
        //             });
        //         }
        //     }
        // }

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

        // private navigateToComponentAfterCreation(prevProps: TProps & IObserveProps) {
        //     const { newConnectionDetail } = this.state;
        //     const { status } = getAsyncConnectionDetail(this.props.state).create;
        //     const prevStatus = getAsyncConnectionDetail(prevProps.state).create.status;
        //     if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
        //         redirectTo({
        //             routeKey: ROUTE_KEYS.R_CONNECTION_DETAIL,
        //             params: {
        //                 name: newConnectionDetail.name,
        //             },
        //         });
        //     }
        // }

        // private navigateToConnectionAfterDeletion(prevProps: TProps & IObserveProps) {
        //     const { status } = getAsyncConnectionDetail(this.props.state).remove;
        //     const prevStatus = getAsyncConnectionDetail(prevProps.state).remove.status;

        //     if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
        //         redirectTo({
        //             routeKey: ROUTE_KEYS.R_CONNECTIONS,
        //         });
        //     }
        // }

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
function getParametersFromEnvironment(environment: IEnvironment, environments: IEnvironment) {
    const parameters = environment
        ? environment.parameters
            .map((parameter) => ({
                name: parameter.name,
                value: parameter.value,
                mandatory: environments
                    ? environments.parameters
                        .some((type) => type.name === parameter.name && type.value === parameter.value)
                    : false,
            }))
        : [];

    const mandatoryParameters = parameters
        .filter((p) => p.mandatory)
        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name));

    const nonMandatoryParameters = parameters
        .filter((p) => !p.mandatory)
        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name));

    const allParameters = mandatoryParameters.concat(nonMandatoryParameters);

    const newListItems: IListItem<IConnectionParameter>[] = allParameters.map((parameter, index) => ({
        id: index,
        columns: {
            name: parameter.name.concat(parameter.mandatory ? '*' : ''),
            value: parameter.value,
        },
        data: {
            name: parameter.name,
            value: parameter.value,
            mandatory: parameter.mandatory,
        },
        canBeDeleted: !parameter.mandatory,
    }));

    return newListItems;
}

// function mapConnectionTypeToListItems(items: IConnectionType[]) {
//     const connectionToList: IListItem<IConnectionTypeColumnNames, IListData>[] = items
//         ? items.map((item) => ({
//             id: item.type,
//             columns: {
//                 name: item.name,
//                 type: item.type,
//             },
//             data: {
//                 type: item.type,
//             },
//         })) : [];
//     return connectionToList;
// }

// function orderConnectionParameters(items: IConnectionParameter[], connectionType: IConnectionType) {
//     const parameters = items
//         ? items
//             .map((parameter) => ({
//                 name: parameter.name,
//                 value: parameter.value,
//                 mandatory: connectionType
//                     ? connectionType.parameters
//                         .some((type) => type.name === parameter.name && type.mandatory === true)
//                     : false,
//             }))
//         : [];
//     const mandatoryParameters = parameters
//         .filter((p) => p.mandatory)
//         .sort((a, b) => a.name.toLowerCase().localeCompare(b.name));
//     const nonMandatoryParameters = parameters
//         .filter((p) => !p.mandatory)
//         .sort((a, b) => a.name.toLowerCase().localeCompare(b.name));
//     const orderedParameters: IConnectionParameter[] = mandatoryParameters
//         .concat(nonMandatoryParameters)
//         .map((p) => ({
//             name: p.name,
//             value: p.value,
//             }));
//         return orderedParameters;
//     }

export default observe([
    StateChangeNotification.ENVIRONMENT_DETAIL,
], withRouter(EnvironmentDetail));
