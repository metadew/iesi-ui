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
import { THEME_COLORS } from 'config/themes/colors';
import { IConnection, IConnectionEnvironment, IConnectionParameter } from 'models/state/connections.model';
import { IObserveProps, observe } from 'views/observe';
import { getAsyncConnectionDetail } from 'state/entities/connections/selectors';
import { StateChangeNotification } from 'models/state.models';
import { getUniqueIdFromConnection } from 'utils/connections/connectionUtils';
import { clone } from 'lodash';
import Loader from 'views/common/waiting/Loader';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { getAsyncConnectionTypes } from 'state/entities/constants/selectors';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel';
import { getRouteKeyByPath, redirectTo, ROUTE_KEYS } from 'views/routes';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { Alert, Autocomplete } from '@material-ui/lab';
import { IConnectionType } from 'models/state/constants.models';
import { IListItem, ListColumns } from 'models/list.models';
import {
    triggerCreateConnectionDetail,
    triggerDeleteConnectionDetail,
    triggerUpdateConnectionDetail,
} from 'state/entities/connections/triggers';
import { checkAuthority, checkAuthorityGeneral } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import requiredFieldsCheck from 'utils/form/requiredFieldsCheck';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import TextInput from 'views/common/input/TextInput';
import { getTranslator } from 'state/i18n/selectors';
import { TRequiredFieldsState } from 'models/form.models';
import GenericList from 'views/common/list/GenericList';
import { Delete, Edit } from '@material-ui/icons';
import DescriptionList from 'views/common/list/DescriptionList';
import EditEnvironments from './EditEnvironments';
import EditParameter from '../EditParameter';
import DetailActions from '../DetailActions';

const styles = (({ palette }: Theme) => createStyles({
    addButton: {
        backgroundColor: palette.type === 'light'
            ? THEME_COLORS.GREY_LIGHT
            : darken(THEME_COLORS.GREY_DARK, 0.2),
    },
}));

type TProps = WithStyles<typeof styles>;

interface IConnectionTypeColumnNames {
    name: string;
    type: string;
}

interface IListData {
    type: string;
}

interface IComponentState {
    newConnectionDetail: IConnection;
    environmentIndex: number;
    editParameterIndex: number;
    isAddingParameter: boolean;
    hasChangesToCheck: boolean;
    isSaveDialogOpen: boolean;
    isConfirmDeleteConnectionOpen: boolean;
    requiredFieldsState: TRequiredFieldsState<IConnection>;
}

const initialConnectionDetail: IConnection = {
    type: '',
    securityGroupName: '',
    name: '',
    description: '',
    environments: [],
};

const ConnectionDetail = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps & RouteComponentProps, IComponentState> {
        public constructor(props: TProps & IObserveProps & RouteComponentProps) {
            super(props);

            this.state = {
                newConnectionDetail: initialConnectionDetail,
                environmentIndex: -1,
                editParameterIndex: -1,
                isAddingParameter: false,
                hasChangesToCheck: false,
                isSaveDialogOpen: false,
                isConfirmDeleteConnectionOpen: false,
                requiredFieldsState: {
                    type: {
                        showError: false,
                    },
                    name: {
                        showError: false,
                    },
                    securityGroupName: {
                        showError: false,
                    },
                },
            };

            // eslint-disable-next-line max-len
            this.updateConnectionInStateIfNewConnectionWasLoaded = this.updateConnectionInStateIfNewConnectionWasLoaded.bind(this);
            this.navigateToComponentAfterCreation = this.navigateToComponentAfterCreation.bind(this);
            this.navigateToConnectionAfterDeletion = this.navigateToConnectionAfterDeletion.bind(this);
            this.renderConnectionDetailPanel = this.renderConnectionDetailPanel.bind(this);
            this.renderEditParameterContent = this.renderEditParameterContent.bind(this);
            this.renderConnectionDetailContent = this.renderConnectionDetailContent.bind(this);
            this.onDeleteConnection = this.onDeleteConnection.bind(this);
            this.isCreateConnectionRoute = this.isCreateConnectionRoute.bind(this);
            this.getEditParameter = this.getEditParameter.bind(this);
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            this.updateConnectionInStateIfNewConnectionWasLoaded(prevProps);
            this.navigateToComponentAfterCreation(prevProps);
            this.navigateToConnectionAfterDeletion(prevProps);
        }

        public render() {
            const {
                newConnectionDetail,
                isAddingParameter,
                isConfirmDeleteConnectionOpen,
                isSaveDialogOpen,
            } = this.state;
            const { state } = this.props;
            const connectionDetailAsyncStatus = getAsyncConnectionDetail(state).fetch.status;
            const connectionTypeAsyncStatus = getAsyncConnectionTypes(state).fetch.status;
            const deleteStatus = getAsyncConnectionDetail(state).remove.status;
            const parameter = this.getEditParameter();
            const translator = getTranslator(state);
            return (
                <>
                    <Loader
                        show={
                            connectionDetailAsyncStatus === AsyncStatus.Busy
                            || connectionTypeAsyncStatus === AsyncStatus.Busy
                        }
                    />
                    <ContentWithSidePanel
                        panel={this.renderConnectionDetailPanel()}
                        content={this.renderConnectionDetailContent()}
                        goBackTo={ROUTE_KEYS.R_CONNECTIONS}
                        contentOverlay={(parameter || isAddingParameter) && (
                            this.renderEditParameterContent()
                        )}
                        contentOverlayOpen={!!(isAddingParameter || parameter)}
                        toggleLabel={<Translate msg="connections.detail.side.toggle_button" />}
                    />
                    <ConfirmationDialog
                        title={translator('connections.detail.delete_connection_dialog.title')}
                        text={translator('connections.detail.delete_connection_dialog.text')}
                        open={isConfirmDeleteConnectionOpen}
                        onClose={() => this.setState({ isConfirmDeleteConnectionOpen: false })}
                        onConfirm={this.onDeleteConnection}
                        showLoader={deleteStatus === AsyncStatus.Busy}
                    />
                    <ClosableDialog
                        title={translator('connections.detail.save_connection_dialog.title')}
                        open={isSaveDialogOpen}
                        onClose={() => this.setState({ isSaveDialogOpen: false })}
                    >
                        <Typography>
                            {
                                checkAuthority(
                                    state,
                                    SECURITY_PRIVILEGES.S_CONNECTIONS_WRITE,
                                    newConnectionDetail.securityGroupName,
                                )
                                    ? (
                                        <Translate
                                            msg="connections.detail.save_connection_dialog.text"
                                            placeholders={{
                                                connectionName: newConnectionDetail.name,
                                            }}
                                        />
                                    ) : (
                                        <Translate
                                            msg="connections.detail.save_connection_dialog.text_securityGroup"
                                            placeholders={{
                                                securityGroup: newConnectionDetail.securityGroupName,
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
                                        if (this.isCreateConnectionRoute()) {
                                            triggerCreateConnectionDetail(newConnectionDetail);
                                        } else {
                                            triggerUpdateConnectionDetail(newConnectionDetail);
                                        }
                                        this.setState({ isSaveDialogOpen: false });
                                    }}
                                    variant="contained"
                                    color="secondary"
                                    disabled={!checkAuthority(
                                        state,
                                        SECURITY_PRIVILEGES.S_CONNECTIONS_WRITE,
                                        newConnectionDetail.securityGroupName,
                                    )}

                                >
                                    {
                                        this.isCreateConnectionRoute() ? (
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

        private renderConnectionDetailPanel() {
            const {
                newConnectionDetail,
                environmentIndex,
                requiredFieldsState,
            } = this.state;
            const { state } = this.props;
            const translator = getTranslator(state);
            const connectionTypes = getAsyncConnectionTypes(state).data || [];
            const connectionTypeListItems = mapConnectionTypeToListItems(connectionTypes);
            const autoComplete = connectionTypeListItems
                .find((item) => item.data.type === newConnectionDetail.type);
            return (
                <Box mt={1} display="flex" flexDirection="column" flex="1 1 auto">
                    <Box flex="1 1 auto">
                        <form noValidate autoComplete="off">
                            <Autocomplete
                                id="combo-box-connection-types"
                                options={connectionTypeListItems}
                                value={autoComplete || null}
                                getOptionLabel={(option) => option.data.type}
                                getOptionDisabled={() =>
                                    !checkAuthorityGeneral(
                                        state,
                                        SECURITY_PRIVILEGES.S_CONNECTIONS_WRITE,
                                    )}
                                renderInput={(params) => (
                                    <TextInput
                                        {...params}
                                        label={translator('connections.detail.side.connection_type')}
                                        variant="filled"
                                        error={requiredFieldsState.type.showError}
                                        // eslint-disable-next-line max-len
                                        helperText={requiredFieldsState.type.showError && 'Connection type is a required field'}
                                        InputProps={{
                                            ...params.InputProps,
                                            readOnly: !this.isCreateConnectionRoute() && !checkAuthority(
                                                state,
                                                SECURITY_PRIVILEGES.S_CONNECTIONS_WRITE,
                                                newConnectionDetail.securityGroupName,
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
                                        environments: newConnectionDetail.environments
                                            .map((environment) => (
                                                {
                                                    ...environment,
                                                    parameters: newValue
                                                        ? connectionTypes
                                                            .find((item) => item.type === newValue?.data?.type)
                                                            .parameters?.filter((item) => item.mandatory)
                                                            .map((item) => ({ name: item.name, value: '' }))
                                                        : [],

                                                }
                                            )),
                                    });
                                }}
                            />
                            <TextInput
                                id="connection-name"
                                label={translator('connections.detail.side.connection_name')}
                                InputProps={{
                                    readOnly: !this.isCreateConnectionRoute() && newConnectionDetail !== undefined,
                                    //    && !checkAuthorityGeneral(state, SECURITY_PRIVILEGES.S_CONNECTIONS_WRITE),
                                    disableUnderline: true,
                                }}
                                value={newConnectionDetail.name}
                                onChange={(e) => this.updateConnection({ name: e.target.value })}
                                required={this.isCreateConnectionRoute()}
                                error={requiredFieldsState.name.showError}
                                helperText={requiredFieldsState.name.showError && 'Component name is a required field'}
                            />
                            <TextInput
                                id="connection-description"
                                label={translator('connections.detail.side.connection_description')}
                                multiline
                                rows={8}
                                InputProps={{
                                    readOnly: (!this.isCreateConnectionRoute && newConnectionDetail !== undefined)
                                        || !checkAuthority(
                                            state,
                                            SECURITY_PRIVILEGES.S_CONNECTIONS_WRITE,
                                            newConnectionDetail.securityGroupName,
                                        ),
                                    disableUnderline: true,

                                }}
                                value={newConnectionDetail.description}
                                onChange={(e) => this.updateConnection({
                                    description: e.target.value,
                                })}
                            />
                            {
                                this.isCreateConnectionRoute() ? (
                                    <>
                                        <TextInput
                                            id="connection-security-group"
                                            label={translator('connections.detail.side.connection_security')}
                                            error={requiredFieldsState.securityGroupName.showError}
                                            // eslint-disable-next-line max-len
                                            helperText={requiredFieldsState.securityGroupName.showError && 'Security group is a required field'}
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
                                                    environments={newConnectionDetail && newConnectionDetail.environments}
                                                    selectedIndex={environmentIndex}
                                                    // eslint-disable-next-line max-len
                                                    onEnvironmentSelected={(index) => this.setState({ environmentIndex: index })}
                                                    onSubmit={(newEnvironment) => {
                                                        this.updateConnection({
                                                            environments: [...newConnectionDetail.environments, {
                                                                ...newEnvironment,
                                                                parameters: newConnectionDetail.type
                                                                    ? connectionTypes
                                                                        // eslint-disable-next-line max-len
                                                                        .find((item) => item.type === newConnectionDetail.type)
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
                                                onEnvironmentSelected={(index) => this.setState({ environmentIndex: index })}
                                                onSubmit={(newEnvironment) => {
                                                    this.updateConnection({
                                                        environments: [...newConnectionDetail.environments, {
                                                            ...newEnvironment,
                                                            parameters: newConnectionDetail.type
                                                                ? connectionTypes
                                                                    // eslint-disable-next-line max-len
                                                                    .find((item) => item.type === newConnectionDetail.type)
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
                            }
                        </form>
                    </Box>
                </Box>
            );
        }

        private renderConnectionDetailContent() {
            const {
                newConnectionDetail,
                environmentIndex,
                hasChangesToCheck,
            } = this.state;
            const { state } = this.props;
            const translator = getTranslator(state);
            const connectionTypes = getAsyncConnectionTypes(state).data || [];
            const matchingConnectionType = connectionTypes.find((item) => item.type === newConnectionDetail.type);
            const parameterItems = getParametersFromEnvironment(
                newConnectionDetail?.environments[environmentIndex],
                matchingConnectionType,
            );
            const hasParameters = parameterItems.length > 0;

            const handleSaveAction = () => {
                const { passed: passedRequired, requiredFieldsState } = requiredFieldsCheck({
                    data: newConnectionDetail,
                    requiredFields: ['type', 'name', 'securityGroupName'],
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

            const parameterColumns: ListColumns<IConnectionParameter> = {
                name: {
                    label: <Translate msg="connections.detail.main.list.labels.name" />,
                    fixedWidth: '40%',
                },
                value: {
                    label: <Translate msg="connections.detail.main.list.labels.value" />,
                    fixedWidth: '60%',
                },
            };

            if (!hasParameters) {
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
                                <Translate msg="connections.detail.main.no_parameters.title" />
                            </Typography>
                        </Box>
                    </Box>
                );
            }

            return (
                <>
                    <Box>
                        <Collapse in={hasChangesToCheck}>
                            <Box marginX={2} marginBottom={2}>
                                <Alert severity="warning">
                                    <Translate msg="connections.detail.main.alert.save_changes" />
                                </Alert>
                            </Box>
                        </Collapse>
                        <DetailActions
                            onSave={handleSaveAction}
                            onDelete={() => this.setState({ isConfirmDeleteConnectionOpen: true })}
                            onAdd={() => {
                                this.setState({ isAddingParameter: true });
                            }}
                            isCreateRoute={this.isCreateConnectionRoute()}
                        />
                    </Box>
                    <Box marginY={1}>
                        <GenericList
                            listItems={parameterItems}
                            columns={parameterColumns}
                            listActions={[{
                                icon: <Edit />,
                                label: translator('connections.detail.main.list.actions.edit'),
                                onClick: (_, index) => {
                                    this.setState({ editParameterIndex: index });
                                },
                                hideAction: () => (
                                    !checkAuthority(
                                        state,
                                        SECURITY_PRIVILEGES.S_CONNECTIONS_WRITE,
                                        newConnectionDetail.securityGroupName,
                                    )
                                ),
                            }, {
                                icon: <Delete />,
                                label: translator('connections.detail.main.list.actions.delete'),
                                onClick: (_, index) => {
                                    const newParameters = [
                                        ...newConnectionDetail.environments[environmentIndex].parameters,
                                    ];
                                    newParameters.splice(index, 1);
                                    this.updateConnection({
                                        environments: newConnectionDetail.environments
                                            .map((environment, envIndex) => (
                                                envIndex === environmentIndex
                                                    ? { ...environment, parameters: newParameters }
                                                    : environment
                                            )),
                                    });
                                },
                                hideAction: (item) => (
                                    !checkAuthority(
                                        state,
                                        SECURITY_PRIVILEGES.S_CONNECTIONS_WRITE,
                                        newConnectionDetail.securityGroupName,
                                    )
                                    || !item.canBeDeleted
                                ),
                            }]}
                        />
                    </Box>
                </>
            );
        }

        private renderEditParameterContent() {
            const {
                newConnectionDetail,
                environmentIndex,
                editParameterIndex,
                isAddingParameter,
            } = this.state;
            const { state } = this.props;
            // if editing, get current parameters else (adding new parameter) create an empty parameter
            const parameter = editParameterIndex > -1 ? this.getEditParameter() : {
                name: '',
                value: '',
            };

            const connectionTypes = getAsyncConnectionTypes(state).data || [];
            const matchingConnectionType = connectionTypes
                .find((item) => item.type === newConnectionDetail?.type);
            const mandatory = matchingConnectionType
                ? matchingConnectionType.parameters
                    .some((item) => item.name === parameter.name && item.mandatory)
                : false;
            return (
                <EditParameter
                    onClose={() => this.setState({ editParameterIndex: -1, isAddingParameter: false })}
                    parameter={parameter}
                    mandatory={mandatory}
                    isCreateParameter={isAddingParameter}
                    onEdit={(newParameter) => {
                        let newParameters: IConnectionParameter[];
                        if (isAddingParameter) {
                            newParameters = [
                                ...newConnectionDetail.environments[environmentIndex].parameters, newParameter,
                            ];
                        } else {
                            newParameters = [...newConnectionDetail.environments[environmentIndex].parameters];
                            newParameters[editParameterIndex] = newParameter;
                        }
                        const orderedEnvironments = orderEnvironments(
                            newConnectionDetail, matchingConnectionType, newParameters,
                        );
                        this.updateConnection({
                            environments: orderedEnvironments,
                        });
                    }}
                />
            );
        }

        private updateConnectionInStateIfNewConnectionWasLoaded(prevProps: TProps & IObserveProps) {
            const connectionDetail = getAsyncConnectionDetail(this.props.state).data;
            const prevConnectionDetail = getAsyncConnectionDetail(prevProps.state).data;
            if (getUniqueIdFromConnection(connectionDetail) !== getUniqueIdFromConnection(prevConnectionDetail)) {
                const connectionDetailDeepClone = clone(connectionDetail);
                if (connectionDetailDeepClone) {
                    const connectionTypes = getAsyncConnectionTypes(this.props.state).data || [];
                    const matchingConnectionType = connectionTypes
                        .find((item) => item.type === connectionDetailDeepClone.type);
                    const orderedEnvironments = orderEnvironments(
                        connectionDetailDeepClone, matchingConnectionType,
                    );
                    this.setState({
                        newConnectionDetail: {
                            ...connectionDetailDeepClone,
                            environments: orderedEnvironments,
                        },
                    });
                }
            }
        }

        private updateConnection(fieldsToUpdate: Partial<IConnection>) {
            this.setState((prevState) => ({
                newConnectionDetail: {
                    ...prevState.newConnectionDetail,
                    ...fieldsToUpdate,
                },
                hasChangesToCheck: true,
            }));
        }

        private onDeleteConnection() {
            const { state } = this.props;
            const detail = getAsyncConnectionDetail(state).data;
            if (detail) {
                triggerDeleteConnectionDetail({ name: detail.name });
            }
        }

        private navigateToComponentAfterCreation(prevProps: TProps & IObserveProps) {
            const { newConnectionDetail } = this.state;
            const { status } = getAsyncConnectionDetail(this.props.state).create;
            const prevStatus = getAsyncConnectionDetail(prevProps.state).create.status;
            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                redirectTo({
                    routeKey: ROUTE_KEYS.R_CONNECTION_DETAIL,
                    params: {
                        name: newConnectionDetail.name,
                    },
                });
            }
        }

        private navigateToConnectionAfterDeletion(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncConnectionDetail(this.props.state).remove;
            const prevStatus = getAsyncConnectionDetail(prevProps.state).remove.status;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                redirectTo({
                    routeKey: ROUTE_KEYS.R_CONNECTIONS,
                });
            }
        }

        private getEditParameter() {
            const { newConnectionDetail, environmentIndex, editParameterIndex } = this.state;
            if (editParameterIndex === -1) {
                return null;
            }
            return newConnectionDetail
                && newConnectionDetail.environments
                && newConnectionDetail.environments[environmentIndex].parameters
                && clone(newConnectionDetail.environments[environmentIndex].parameters[editParameterIndex]);
        }

        private isCreateConnectionRoute() {
            const currentRouteKey = getRouteKeyByPath({ path: this.props.match.path });
            return currentRouteKey === ROUTE_KEYS.R_CONNECTION_NEW;
        }
    },
);

function getParametersFromEnvironment(environment: IConnectionEnvironment, connectionType: IConnectionType) {
    const parameters = environment
        ? environment.parameters
            .map((parameter) => ({
                name: parameter.name,
                value: parameter.value,
                mandatory: connectionType
                    ? connectionType.parameters
                        .some((type) => type.name === parameter.name && type.mandatory === true)
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

function mapConnectionTypeToListItems(items: IConnectionType[]) {
    const connectionToList: IListItem<IConnectionTypeColumnNames, IListData>[] = items
        ? items.map((item) => ({
            id: item.type,
            columns: {
                name: item.name,
                type: item.type,
            },
            data: {
                type: item.type,
            },
        })) : [];
    return connectionToList;
}

function orderConnectionParameters(items: IConnectionParameter[], connectionType: IConnectionType) {
    const parameters = items
        ? items
            .map((parameter) => ({
                name: parameter.name,
                value: parameter.value,
                mandatory: connectionType
                    ? connectionType.parameters
                        .some((type) => type.name === parameter.name && type.mandatory === true)
                    : false,
            }))
        : [];
    const mandatoryParameters = parameters
        .filter((p) => p.mandatory)
        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name));
    const nonMandatoryParameters = parameters
        .filter((p) => !p.mandatory)
        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name));
    const orderedParameters: IConnectionParameter[] = mandatoryParameters
        .concat(nonMandatoryParameters)
        .map((p) => ({
            name: p.name,
            value: p.value,
        }));
    return orderedParameters;
}

function orderEnvironments(
    connection: IConnection, connectionType: IConnectionType, connectionParameter?: IConnectionParameter[],
) {
    const orderedEnvironments: IConnectionEnvironment[] = connection.environments
        .map((environmentDetail) => {
            const newOrderedParameters: IConnectionParameter[] = orderConnectionParameters(
                connectionParameter || environmentDetail.parameters, connectionType,
            );
            return {
                ...environmentDetail,
                parameters: newOrderedParameters,
            };
        });
    return orderedEnvironments;
}

export default observe([
    StateChangeNotification.CONNECTIVITY_CONNECTION_DETAIL,
    StateChangeNotification.CONSTANTS_CONNECTION_TYPES,
], withRouter(ConnectionDetail));
