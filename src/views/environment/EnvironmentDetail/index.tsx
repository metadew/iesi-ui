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
// import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
// import { checkAuthority } from 'state/auth/selectors';
import TextInput from 'views/common/input/TextInput';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
import GenericList from 'views/common/list/GenericList';
import DetailActions from 'views/connectivity/DetailActions';
import {
    triggerCreateEnvironmentDetail,
    triggerDeleteEnvironmentDetail,
    triggerUpdateEnvironmentDetail } from 'state/entities/environments/triggers';
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
            // this.updateConnectionInStateIfNewConnectionWasLoaded = this.updateConnectionInStateIfNewConnectionWasLoaded.bind(this);
            this.navigateToComponentAfterCreation = this.navigateToComponentAfterCreation.bind(this);
            this.navigateToEnvironmentAfterDeletion = this.navigateToEnvironmentAfterDeletion.bind(this);
            this.renderEnvironmentDetailPanel = this.renderEnvironmentDetailPanel.bind(this);
            this.renderEditParameterContent = this.renderEditParameterContent.bind(this);
            this.renderEnvironmentDetailContent = this.renderEnvironmentDetailContent.bind(this);
            this.onDeleteEnvironment = this.onDeleteEnvironment.bind(this);
            this.isCreateEnvironmentRoute = this.isCreateEnvironmentRoute.bind(this);
            this.getEditParameter = this.getEditParameter.bind(this);
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            // this.updateConnectionInStateIfNewConnectionWasLoaded(prevProps);
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
            // const environments = getAsyncEnvironments(state).data.environments || [];
            // const environmentListItems = mapEnvironmentsToListItems(environments);
            // const autoComplete = environmentListItems
            //     .find((item) => item.data.name === newEnvironmentDetail.name);

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

        // private renderEnvironmentDetailPanel() {
        //     const {
        //         newEnvironmentDetail,
        //         // environmentIndex,
        //         requiredFieldsState,
        //     } = this.state;
        //     const { state } = this.props;
        //     const translator = getTranslator(state);
        //     const environments = getAsyncEnvironments(state).data.environments || [];
        //     const environmentListItems = mapEnvironmentsToListItems(environments);
        //     const autoComplete = environmentListItems
        //     .find((item) => item.data.name === newEnvironmentDetail.name);
        //     return (
        //         <Box mt={1} display="flex" flexDirection="column" flex="1 1 auto">
        //             <Box flex="1 1 auto">
        //                 <form noValidate autoComplete="off">
        //                     <Autocomplete
        //                         id="combo-box-environments"
        //                         options={environmentListItems}
        //                         value={autoComplete || null}
        //                         // getOptionLabel={(option) => option.data.type}
        //                         // getOptionDisabled={() =>
        //                         //     !checkAuthorityGeneral(
        //                         //         state,
        //                         //         SECURITY_PRIVILEGES.S_ENVIRONMENTS_WRITE,
        //                         //     )}
        //                         renderInput={(params) => (
        //                             <TextInput
        //                                 {...params}
        //                                 label={translator('environments.detail.side.environment')}
        //                                 variant="filled"
        //                                 error={requiredFieldsState.name.showError}
        //                                 // eslint-disable-next-line max-len
        //                                 helperText={requiredFieldsState.name.showError &&
        //                                     'Environment is a required field'}
        //                                 InputProps={{
        //                                     ...params.InputProps,
        //                                     readOnly: !this.isCreateEnvironmentRoute(),
        //                                     // && !checkAuthority(
        //                                     //     state,
        //                                     //     SECURITY_PRIVILEGES.S_ENVIRONMENTS_WRITE,
        //                                     // ),
        //                                     disableUnderline: true,
        //                                 }}
        //                             />
        //                         )}
        //                         // onChange={(
        //                         //     e: React.ChangeEvent<{}>,
        //                         //     newValue: IListItem<IEnvironmentColumnNamesBase, IListData>,
        //                         // ) => {
        //                         //     this.updateEnvironment({
        //                         //         type: newValue ? newValue.data.type : null,
        //                         //         environments: newEnvironmentDetail.environments
        //                         //             .map((environment) => (
        //                         //                 {
        //                         //                     ...environment,
        //                         //                     parameters: newValue
        //                         //                         ? environments
        //                         //                             .find((item) => item.type === newValue?.data?.type)
        //                         //                             .parameters?.filter((item) => item.mandatory)
        //                         //                             .map((item) => ({ name: item.name, value: '' }))
        //                         //                         : [],

        //                         //                 }
        //                         //             )),
        //                         //     });
        //                         // }}
        //                     />
        //                     <TextInput
        //                         id="environment-name"
        //                         label={translator('environments.detail.side.environment_name')}
        //                         InputProps={{
        //                             readOnly: !this.isCreateEnvironmentRoute() && newEnvironmentDetail !== undefined,
        //                             //    && !checkAuthorityGeneral(state, SECURITY_PRIVILEGES.S_CONNECTIONS_WRITE),
        //                             disableUnderline: true,
        //                         }}
        //                         value={newEnvironmentDetail.name}
        //                         onChange={(e) => this.updateEnvironment({ name: e.target.value })}
        //                         required={this.isCreateEnvironmentRoute()}
        //                         error={requiredFieldsState.name.showError}
        //                         helperText={requiredFieldsState.name.showError
        //                             && 'Environment name is a required field'}
        //                     />
        //                     <TextInput
        //                         id="environment-description"
        //                         label={translator('environments.detail.side.environment_description')}
        //                         multiline
        //                         rows={8}
        //                         InputProps={{
        //                             readOnly: (!this.isCreateEnvironmentRoute && newEnvironmentDetail !== undefined),
        //                             // || !checkAuthority(
        //                             //     state,
        //                             //     SECURITY_PRIVILEGES.S_ENVIRONMENTS_WRITE,
        //                             // ),
        //                             disableUnderline: true,

        //                         }}
        //                         value={newEnvironmentDetail.description}
        //                         onChange={(e) => this.updateEnvironment({
        //                             description: e.target.value,
        //                         })}
        //                     />
        //                     {
        //                         /*
        //                     {
        //                         this.isCreateConnectionRoute() ? (
        //                             <>
        //                                 <TextInput
        //                                     id="connection-security-group"
        //                                     label={translator('connections.detail.side.connection_security')}
        //                                     error={requiredFieldsState.securityGroupName.showError}
        //                                     // eslint-disable-next-line max-len
        //                                     helperText={requiredFieldsState.securityGroupName.showError
        //                                         && 'Security group is a required field'}
        //                                     value={newConnectionDetail && newConnectionDetail.securityGroupName
        //                                         ? newConnectionDetail.securityGroupName : ''}
        //                                     onChange={(e) => this.updateConnection({
        //                                         securityGroupName: e.target.value,
        //                                     })}
        //                                     InputProps={{
        //                                         disableUnderline: true,
        //                                     }}
        //                                     required
        //                                 />
        //                                 <DescriptionList
        //                                     noLineAfterListItem
        //                                     items={[].concat({
        //                                         label: <Translate msg="connections.detail.side" />,
        //                                         value: <EditEnvironments
        //                                             // eslint-disable-next-line max-len
        //                                             environments={newConnectionDetail &&
        //                                                 newConnectionDetail.environments}
        //                                             selectedIndex={environmentIndex}
        //                                             onEnvironmentSelected={(index) =>
        //                                                 this.setState({ environmentIndex: index })}
        //                                             onSubmit={(newEnvironment) => {
        //                                                 this.updateConnection({
        //                                                     environments: [...newConnectionDetail.environments, {
        //                                                         ...newEnvironment,
        //                                                         parameters: newConnectionDetail.type
        //                                                             ? connectionTypes
        //                                                                 // eslint-disable-next-line max-len
        //                                                                 .find((item) => item.type
        //                                                                 === newConnectionDetail.type)
        //                                                                 .parameters?.filter((item) => item.mandatory)
        //                                                                 .map((item) =>
        //                                                                  ({ name: item.name, value: '' }))
        //                                                             : [],
        //                                                     }],
        //                                                 });
        //                                             }}
        //                                             onDelete={(index) => {
        //                                                 const environments = [...newConnectionDetail.environments];
        //                                                 environments.splice(index, 1);
        //                                                 this.updateConnection({
        //                                                     environments,
        //                                                 });
        //                                             }}
        //                                             isCreateConnectionRoute={this.isCreateConnectionRoute()}
        //                                         />,
        //                                     })}
        //                                 />
        //                             </>
        //                         ) : (
        //                             <DescriptionList
        //                                 noLineAfterListItem
        //                                 items={[].concat({
        //                                     label: translator('connections.detail.side.connection_security'),
        //                                     value: newConnectionDetail && newConnectionDetail.securityGroupName
        //                                         ? newConnectionDetail.securityGroupName : '',
        //                                 }, {
        //                                     label: <Translate msg="connections.detail.side.environments.title" />,
        //                                     value: <EditEnvironments
        //                                         environments={newConnectionDetail &&
        //                                          newConnectionDetail.environments}
        //                                         selectedIndex={environmentIndex}
        //                                         // eslint-disable-next-line max-len
        //                                         onEnvironmentSelected={(index) =>
        //                                             this.setState({ environmentIndex: index })}
        //                                         onSubmit={(newEnvironment) => {
        //                                             this.updateConnection({
        //                                                 environments: [...newConnectionDetail.environments, {
        //                                                     ...newEnvironment,
        //                                                     parameters: newConnectionDetail.type
        //                                                         ? connectionTypes
        //                                                             // eslint-disable-next-line max-len
        //                                                             .find((item) => item.type ===
        //                                                             newConnectionDetail.type)
        //                                                             .parameters?.filter((item) => item.mandatory)
        //                                                             .map((item) => ({ name: item.name, value: '' }))
        //                                                         : [],
        //                                                 }],
        //                                             });
        //                                         }}
        //                                         onDelete={(index) => {
        //                                             const environments = [...newConnectionDetail.environments];
        //                                             environments.splice(index, 1);
        //                                             this.updateConnection({
        //                                                 environments,
        //                                             });
        //                                         }}
        //                                         isCreateConnectionRoute={this.isCreateConnectionRoute()}
        //                                     />,
        //                                 })}
        //                             />
        //                         )
        //                     } */}
        //                 </form>
        //             </Box>
        //         </Box>
        //     );
        // }

        private renderEnvironmentDetailContent() {
            const {
                newEnvironmentDetail,
                // environmentIndex,
                hasChangesToCheck,
            } = this.state;
            const { state } = this.props;
            const translator = getTranslator(state);
            // const environments = getAsyncEnvironments(state).data.environments || [];
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
                                hideAction: () => null,
                            }, {
                                icon: <Delete />,
                                label: translator('environments.detail.main.list.actions.delete'),
                                onClick: (_, index) => this.setState({ editParameterIndex: index }),
                                // onClick: (_, index) => {
                                //     if (newEnvironmentDetail.parameters.length > 0) {
                                //         const newParameters = [...newEnvironmentDetail.parameters];
                                //         newParameters.splice(index, 1);
                                //         this.updateEnvironment({
                                //             parameters: newParameters,
                                //         });
                                //     }
                                // },
                                hideAction: () => null,
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
                        const orderedParameters = orderComponentParameters(newParameters, matchingEnvironment);
                        this.updateEnvironment({
                            parameters: orderedParameters,
                        });
                    }}
                    // onClose={() => this.setState({ editParameterIndex: -1, isAddingParameter: false })}
                    // parameter={parameter}
                    // isCreateParameter={isAddingParameter}
                    // mandatory={null}
                    // onEdit={(newParameter) => {
                    //     const parameters = editParameterIndex !== null ? (
                    //         newEnvironmentDetail.parameters.map((paramState, index) => {
                    //             if (index !== editParameterIndex) {
                    //                 return paramState;
                    //             }
                    //             return newParameter;
                    //         })
                    //     ) : [...newEnvironmentDetail.parameters, newParameter];
                    //     this.updateEnvironment({ parameters });
                    // }}
                    // newParameter={newEnvironmentDetail.parameters[editParameterIndex]}
                    // onEdit={(newParameter) => {
                    //     let newParameters: IEnvironmentParameter[];
                    //     if (isAddingParameter) {
                    //         newParameters = [
                    //             ...newEnvironmentDetail.parameters, newParameter,
                    //         ];
                    //     } else {
                    //         newParameters = [...newEnvironmentDetail.parameters];
                    //         newParameters[editParameterIndex] = newParameter;
                    //     }

                    // const orderedEnvironments = orderEnvironments(
                    //     newEnvironmentDetail, matchingEnvironment,
                    //     newParameters,
                    //     newEnvironmentDetail.environments[environmentIndex],
                    // );
                    // this.updateConnection({
                    //     environments: orderedEnvironments,
                    // });
                // }}
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

// function mapEnvironmentsToListItems(items: IEnvironment[]) {
//     const environmentToList: IListItem<IEnvironmentColumnNamesBase, IListData>[] = items
//         ? items.map((item) => ({
//             // id: item,
//             columns: {
//                 name: item.name,
//                 description: item.description,
//             },
//             data: {
//                 name: item.name,
//                 description: item.description,
//             },
//         })) : [];
//     return environmentToList;
// }

function orderComponentParameters(items: IEnvironmentParameter[], environment: IEnvironment) {
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
