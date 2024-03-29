import React from 'react';
import {
    Box,
    Button,
    Collapse,
    createStyles,
    darken,
    Theme,
    Typography,
    WithStyles,
    withStyles,
} from '@material-ui/core';
import { THEME_COLORS } from 'config/themes/colors';
import { Delete, Edit } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { IComponent, IComponentAttribute, IComponentParameter } from 'models/state/components.model';
import {
    triggerCreateComponentDetail,
    triggerDeleteComponentDetail, triggerExportComponentDetail,
    triggerUpdateComponentDetail,
} from 'state/entities/components/triggers';
import { checkAuthority } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import { IObserveProps, observe } from 'views/observe';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel';
import TextInput from 'views/common/input/TextInput';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import { getTranslator } from 'state/i18n/selectors';
import { TRequiredFieldsState } from 'models/form.models';
import requiredFieldsCheck from 'utils/form/requiredFieldsCheck';
import { getRouteKeyByPath, redirectTo, ROUTE_KEYS } from 'views/routes';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getAsyncComponentTypes } from 'state/entities/constants/selectors';
import { IComponentType } from 'models/state/constants.models';
import { IListItem, ListColumns } from 'models/list.models';
import { Alert, Autocomplete } from '@material-ui/lab';
import { IState, StateChangeNotification } from 'models/state.models';
import GenericList from 'views/common/list/GenericList';
import { getAsyncScriptDetail } from 'state/entities/scripts/selectors';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
import Loader from 'views/common/waiting/Loader';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { getAsyncComponentDetail } from 'state/entities/components/selectors';
import { getUniqueIdFromComponent } from 'utils/components/componentUtils';
import DescriptionList from 'views/common/list/DescriptionList';
import { clone } from 'lodash';
import EditParameter from './EditParameter';
import EditAttribute from './EditAttribute';
import DetailActions from './DetailActions';

const styles = (({ palette }: Theme) => createStyles({
    addButton: {
        backgroundColor: palette.type === 'light'
            ? THEME_COLORS.GREY_LIGHT
            : darken(THEME_COLORS.GREY_DARK, 0.2),
    },
    listTitle: {
        marginLeft: 2.2,
        marginRight: 2.2,
    },
}));

type TProps = WithStyles<typeof styles>;

interface IComponentState {
    newComponentDetail: IComponent;
    parameterToEdit: IComponentParameter;
    attributeToEdit: IComponentAttribute;
    editParameterIndex: number;
    editAttributeIndex: number;
    hasChangesToCheck: boolean;
    isAddingParameter: boolean;
    isAddingAttribute: boolean;
    isSaveDialogOpen: boolean;
    isConfirmDeleteComponentOpen: boolean;
    additionalParameters: IComponentParameter[];
    requiredFieldsState: TRequiredFieldsState<IComponent>;
    isComponentTypeOptionsOpen: boolean;
}

interface IColumnNames {
    name: string;
    type: string;
}

interface IListData {
    type: string;
}

const initialComponentDetail: IComponent = {
    type: '',
    name: '',
    description: '',
    version: {
        number: 1,
        description: '',
    },
    parameters: [],
    attributes: [],
    isHandled: false,
    securityGroupName: '',
};

const ComponentDetail = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps & RouteComponentProps, IComponentState> {
        public constructor(props: TProps & IObserveProps & RouteComponentProps) {
            super(props);

            this.state = {
                newComponentDetail: initialComponentDetail,
                hasChangesToCheck: false,
                parameterToEdit: null,
                attributeToEdit: null,
                editParameterIndex: -1,
                editAttributeIndex: -1,
                isAddingParameter: false,
                isAddingAttribute: false,
                isSaveDialogOpen: false,
                isConfirmDeleteComponentOpen: false,
                additionalParameters: [],
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
                isComponentTypeOptionsOpen: false,
            };

            // eslint-disable-next-line max-len
            this.updateComponentInStateIfNewComponentWasLoaded = this.updateComponentInStateIfNewComponentWasLoaded.bind(this);
            this.navigateToComponentAfterCreation = this.navigateToComponentAfterCreation.bind(this);
            this.navigateToComponentAfterDeletion = this.navigateToComponentAfterDeletion.bind(this);

            this.renderComponentDetailPanel = this.renderComponentDetailPanel.bind(this);
            this.renderComponentDetailContent = this.renderComponentDetailContent.bind(this);
            this.renderEditParameterContent = this.renderEditParameterContent.bind(this);

            this.isCreateComponentRoute = this.isCreateComponentRoute.bind(this);
            this.getEditParameter = this.getEditParameter.bind(this);
            this.updateComponent = this.updateComponent.bind(this);

            this.onDeleteComponent = this.onDeleteComponent.bind(this);
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            this.updateComponentInStateIfNewComponentWasLoaded(prevProps);
            this.navigateToComponentAfterCreation(prevProps);
            this.navigateToComponentAfterDeletion(prevProps);
        }

        public render() {
            const {
                isAddingParameter,
                isAddingAttribute,
                isSaveDialogOpen,
                isConfirmDeleteComponentOpen,
                newComponentDetail,
            } = this.state;
            const { state } = this.props;
            const componentDetailAsyncStatus = getAsyncScriptDetail(state).fetch.status;
            const componentTypesAsyncStatus = getAsyncComponentTypes(state).fetch.status;
            const deleteStatus = getAsyncComponentDetail(state).remove.status;
            const parameter = this.getEditParameter();
            const attribute = this.getEditAttribute();
            const translator = getTranslator(state);
            return (
                <>
                    <Loader
                        show={componentDetailAsyncStatus === AsyncStatus.Busy
                            || componentTypesAsyncStatus === AsyncStatus.Busy}
                    />
                    <ContentWithSidePanel
                        panel={this.renderComponentDetailPanel()}
                        content={this.renderComponentDetailContent()}
                        goBackTo={ROUTE_KEYS.R_COMPONENTS}
                        contentOverlay={(parameter || isAddingParameter) ? (
                            this.renderEditParameterContent()
                        ) : (attribute || isAddingAttribute) && (
                            this.renderEditAttributeContent()
                        )}
                        contentOverlayOpen={!!(
                            isAddingParameter
                            || parameter
                            || isAddingAttribute
                            || attribute
                        )}
                        toggleLabel={<Translate msg="components.detail.side.toggle_button" />}
                    />
                    <ConfirmationDialog
                        title={translator('components.detail.delete_component_dialog.title')}
                        text={translator('components.detail.delete_component_dialog.text')}
                        open={isConfirmDeleteComponentOpen}
                        onClose={() => this.setState({ isConfirmDeleteComponentOpen: false })}
                        onConfirm={this.onDeleteComponent}
                        showLoader={deleteStatus === AsyncStatus.Busy}
                    />
                    <ClosableDialog
                        title={translator('components.detail.save_component_dialog.title')}
                        open={isSaveDialogOpen}
                        onClose={() => this.setState({ isSaveDialogOpen: false })}
                    >
                        <Typography>
                            {
                                checkAuthority(
                                    state,
                                    SECURITY_PRIVILEGES.S_COMPONENTS_WRITE,
                                )
                                    ? (
                                        <Translate msg="components.detail.save_component_dialog.text" />
                                    ) : (
                                        <Translate
                                            msg="components.detail.save_component_dialog.text_securityGroup"
                                            placeholders={{
                                                securityGroup: newComponentDetail.securityGroupName,
                                            }}
                                        />
                                    )
                            }
                        </Typography>
                        <Box display="flex" alignItems="center" justifyContent="space-between" marginTop={2}>
                            <Box paddingRight={1}>
                                <Button
                                    id="save-update-current-version"
                                    onClick={() => {
                                        triggerUpdateComponentDetail(newComponentDetail);
                                        this.setState({ isSaveDialogOpen: false });
                                    }}
                                    variant="contained"
                                    color="secondary"
                                    disabled={this.isCreateComponentRoute()
                                        || !checkAuthority(
                                            state,
                                            SECURITY_PRIVILEGES.S_COMPONENTS_WRITE,
                                        )}
                                >
                                    <Translate msg="components.detail.save_component_dialog.update_current_version" />
                                </Button>
                            </Box>
                            <Box paddingLeft={1}>
                                <Button
                                    id="save-save-as-new-version"
                                    onClick={() => {
                                        triggerCreateComponentDetail({
                                            ...newComponentDetail,
                                            version: {
                                                ...newComponentDetail.version,
                                                number: this.isCreateComponentRoute()
                                                    ? newComponentDetail.version.number
                                                    : newComponentDetail.version.number + 1,
                                            },
                                        });
                                        this.setState({ isSaveDialogOpen: false });
                                    }}
                                    color="secondary"
                                    variant="outlined"
                                    disabled={newComponentDetail
                                        && !checkAuthority(
                                            state,
                                            SECURITY_PRIVILEGES.S_COMPONENTS_WRITE,
                                        )}
                                >
                                    <Translate msg="components.detail.save_component_dialog.save_as_new_version" />
                                </Button>
                            </Box>
                        </Box>
                    </ClosableDialog>
                </>
            );
        }

        private renderComponentDetailPanel() {
            const {
                newComponentDetail,
                requiredFieldsState,
            } = this.state;
            const { state } = this.props;
            const translator = getTranslator(state);
            const componentTypesAsyncStatus = getAsyncComponentTypes(state).fetch.status;
            const asyncComponentTypes = getAsyncComponentTypes(state);
            const componentTypes = asyncComponentTypes.data || [];
            const autoCompleteValue = componentTypes
                .find((componentType) => componentType.type === newComponentDetail.type);
            return (
                <Box mt={1} display="flex" flexDirection="column" flex="1 1 auto">
                    <Box flex="1 1 auto">
                        <form noValidate autoComplete="off">
                            <Autocomplete
                                id="combo-box-component-types"
                                options={componentTypes}
                                value={autoCompleteValue
                                    // eslint-disable-next-line max-len
                                    || (newComponentDetail.type && { name: null, type: newComponentDetail.type, parameters: null, category: null })
                                    || null}
                                getOptionLabel={(option) => option.type}
                                // disabled={!checkAuthorityGeneral(state, SECURITY_PRIVILEGES.S_COMPONENTS_WRITE)}
                                renderInput={(params) => (
                                    <TextInput
                                        {...params}
                                        label={translator('components.detail.side.component_type')}
                                        variant="filled"
                                        error={requiredFieldsState.type.showError}
                                        // eslint-disable-next-line max-len
                                        helperText={requiredFieldsState.type.showError && 'Component type is a required field'}
                                        InputProps={{
                                            ...params.InputProps,
                                            readOnly: !checkAuthority(
                                                state,
                                                SECURITY_PRIVILEGES.S_COMPONENTS_WRITE,
                                            ),
                                            disableUnderline: false,
                                        }}
                                    />
                                )}
                                onChange={(
                                    e: React.ChangeEvent<{}>,
                                    newValue: IComponentType,
                                ) => {
                                    this.updateComponent({
                                        type: newValue ? newValue.type : null,
                                        parameters: newValue
                                            ? componentTypes
                                                .find((item) => item.type === newValue?.type)
                                                .parameters?.filter((item) => item.mandatory)
                                                .map((item) => ({ name: item.name, value: '' }))
                                            : [],

                                    });
                                }}
                                loading={componentTypesAsyncStatus === AsyncStatus.Busy}
                                disabled={!checkAuthority(
                                    state,
                                    SECURITY_PRIVILEGES.S_COMPONENTS_WRITE,
                                ) || !this.isCreateComponentRoute()}
                                disableClearable
                            />
                            <TextInput
                                id="component-name"
                                label={translator('components.detail.side.component_name')}
                                InputProps={{
                                    readOnly: !this.isCreateComponentRoute() && newComponentDetail !== undefined,
                                    disableUnderline: true,
                                }}
                                value={newComponentDetail.name}
                                onChange={(e) => this.updateComponent({ name: e.target.value })}
                                required={this.isCreateComponentRoute()}
                                error={requiredFieldsState.name.showError}
                                helperText={requiredFieldsState.name.showError && 'Component name is a required field'}
                            />
                            <TextInput
                                id="component-description"
                                label={translator('components.detail.side.component_description')}
                                multiline
                                rows={8}
                                InputProps={{
                                    readOnly: (!this.isCreateComponentRoute && newComponentDetail !== undefined)
                                        || !checkAuthority(state, SECURITY_PRIVILEGES.S_COMPONENTS_WRITE),
                                    disableUnderline: true,
                                }}
                                value={newComponentDetail.version.description}
                                onChange={(e) => this.updateComponent({
                                    version: {
                                        ...newComponentDetail.version,
                                        description: e.target.value,
                                    },
                                })}
                            />
                            {
                                this.isCreateComponentRoute() ? (
                                    <>
                                        <TextInput
                                            id="component-security-group"
                                            label={translator('components.detail.side.component_security')}
                                            error={requiredFieldsState.securityGroupName.showError}
                                            // eslint-disable-next-line max-len
                                            helperText={requiredFieldsState.securityGroupName.showError && 'Security group is a required field'}
                                            value={newComponentDetail && newComponentDetail.securityGroupName
                                                ? newComponentDetail.securityGroupName : ''}
                                            onChange={(e) => this.updateComponent({
                                                securityGroupName: e.target.value,
                                            })}
                                            InputProps={{
                                                disableUnderline: true,
                                            }}
                                            required
                                        />
                                        <TextInput
                                            id="component-version"
                                            type="number"
                                            label={translator('components.detail.side.component_version')}
                                            value={(newComponentDetail && newComponentDetail.version.number)
                                                ? newComponentDetail.version.number : 0}
                                            onChange={(e) => this.updateComponent({
                                                version: {
                                                    ...newComponentDetail.version,
                                                    number: parseInt(e.target.value, 10),
                                                },
                                            })}
                                            InputProps={{
                                                disableUnderline: true,
                                                inputProps: {
                                                    min: 0,
                                                },
                                            }}

                                        />
                                    </>

                                ) : (
                                    <DescriptionList
                                        noLineAfterListItem
                                        items={[].concat([{
                                            label: translator('components.detail.side.component_version'),
                                            value: newComponentDetail && newComponentDetail.version
                                                ? newComponentDetail.version.number : '',
                                        }, {
                                            label: translator('components.detail.side.component_security'),
                                            value: newComponentDetail && newComponentDetail.securityGroupName
                                                ? newComponentDetail.securityGroupName : '',
                                        }])}
                                    />
                                )
                            }
                        </form>
                    </Box>
                </Box>
            );
        }

        private renderComponentDetailContent() {
            const { newComponentDetail, hasChangesToCheck } = this.state;
            const { state } = this.props;
            const translator = getTranslator(state);
            const componentTypes = getAsyncComponentTypes(state).data || [];
            const matchingComponentType = componentTypes.find((item) => item.type === newComponentDetail.type);
            const parameterItems = getParametersFromComponentDetails(newComponentDetail, matchingComponentType);
            // const attributeItems = getAttributesFromComponentDetails(newComponentDetail);
            const hasParameters = parameterItems.length > 0;
            // const hasAttributes = attributeItems.length > 0;

            const handleSaveAction = () => {
                const { passed: passedRequired, requiredFieldsState } = requiredFieldsCheck({
                    data: newComponentDetail,
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

            const parameterColumns: ListColumns<IComponentParameter> = {
                name: {
                    label: <Translate msg="components.detail.main.list.labels.name" />,
                    fixedWidth: '40%',
                },
                value: {
                    label: <Translate msg="components.detail.main.list.labels.value" />,
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
                                <Translate msg="components.detail.main.no_parameters.title" />
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
                                    <Translate msg="components.detail.main.alert.save_changes" />
                                </Alert>
                            </Box>
                        </Collapse>
                        <DetailActions
                            onSave={handleSaveAction}
                            onDelete={() => this.setState({ isConfirmDeleteComponentOpen: true })}
                            onAdd={() => {
                                this.setState({ isAddingParameter: true });
                            }}
                            onExport={() => this.onExportComponent()}
                            isCreateRoute={this.isCreateComponentRoute()}
                        />
                    </Box>
                    <Box marginY={1}>
                        <GenericList
                            listItems={parameterItems}
                            columns={parameterColumns}
                            listActions={[{
                                icon: <Edit />,
                                label: translator('components.detail.main.list.actions.edit'),
                                onClick: (_, index) => {
                                    this.setState({ editParameterIndex: index });
                                },
                                hideAction: () => (
                                    !checkAuthority(state, SECURITY_PRIVILEGES.S_COMPONENTS_WRITE)
                                ),
                            }, {
                                icon: <Delete />,
                                label: translator('components.detail.main.list.actions.delete'),
                                onClick: (_, index) => {
                                    if (!parameterItems[index].data.mandatory) {
                                        const newParameters = [...newComponentDetail.parameters];
                                        newParameters.splice(index, 1);
                                        this.updateComponent({
                                            parameters: newParameters,
                                        });
                                    }
                                },
                                hideAction: (item) => (
                                    !checkAuthority(state, SECURITY_PRIVILEGES.S_COMPONENTS_WRITE)
                                    || !item.canBeDeleted
                                ),
                            }]}
                        />

                    </Box>
                </>
            );
        }

        private renderEditParameterContent() {
            const { newComponentDetail, editParameterIndex, isAddingParameter } = this.state;
            const { state } = this.props;
            const parameter = editParameterIndex > -1 ? this.getEditParameter() : {
                name: '',
                value: '',
            };
            const matchingComponentType = matchComponentType(state, newComponentDetail);
            const mandatory = matchingComponentType
                ? matchingComponentType.parameters
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
                            ? [...newComponentDetail.parameters, newParameter] : [...newComponentDetail.parameters];
                        if (!isAddingParameter) {
                            newParameters[editParameterIndex] = newParameter;
                        }
                        const orderedParameters = orderComponentParameters(newParameters, matchingComponentType);
                        this.updateComponent({
                            parameters: orderedParameters,
                        });
                    }}
                />
            );
        }

        private renderEditAttributeContent() {
            const { newComponentDetail, editAttributeIndex, isAddingAttribute } = this.state;
            const attribute = editAttributeIndex > -1 ? this.getEditAttribute() : {
                name: '',
                value: '',
                environment: '',
            };
            return (
                <EditAttribute
                    onClose={() => this.setState({ editAttributeIndex: -1, isAddingAttribute: false })}
                    attribute={attribute}
                    isCreateAttribute={isAddingAttribute}
                    onEdit={(newAttribute) => {
                        const newAttributes = [...newComponentDetail.attributes];
                        if (!isAddingAttribute) {
                            newAttributes[editAttributeIndex] = newAttribute;
                        }
                        this.updateComponent({
                            attributes: isAddingAttribute
                                ? [...newComponentDetail.attributes, newAttribute]
                                : newAttributes,
                        });
                    }}
                />
            );
        }

        private updateComponent(fieldsToUpdate: Partial<IComponent>) {
            this.setState((prevState) => ({
                newComponentDetail: {
                    ...prevState.newComponentDetail,
                    ...fieldsToUpdate,
                },
                hasChangesToCheck: true,
            }));
        }

        private onDeleteComponent() {
            const { state } = this.props;
            const detail = getAsyncComponentDetail(state).data;
            if (detail) {
                triggerDeleteComponentDetail({ name: detail.name, version: detail.version.number });
            }
        }

        private onExportComponent() {
            const { state } = this.props;
            const detail = getAsyncComponentDetail(state).data;

            if (detail) {
                triggerExportComponentDetail({
                    name: detail.name,
                    version: detail.version.number,
                });
            }
        }

        private isCreateComponentRoute() {
            const currentRouteKey = getRouteKeyByPath({ path: this.props.match.path });
            return currentRouteKey === ROUTE_KEYS.R_COMPONENT_NEW;
        }

        private getEditParameter() {
            const { newComponentDetail, editParameterIndex } = this.state;
            if (editParameterIndex === -1) {
                return null;
            }
            return newComponentDetail
                && newComponentDetail.parameters
                && clone(newComponentDetail.parameters[editParameterIndex]);
        }

        private getEditAttribute() {
            const { newComponentDetail, editAttributeIndex } = this.state;
            if (editAttributeIndex === -1) {
                return null;
            }
            return newComponentDetail
                && newComponentDetail.attributes
                && clone(newComponentDetail.attributes[editAttributeIndex]);
        }

        private updateComponentInStateIfNewComponentWasLoaded(prevProps: TProps & IObserveProps) {
            const componentDetail = getAsyncComponentDetail(this.props.state).data;
            const prevComponentDetail = getAsyncComponentDetail(prevProps.state).data;
            // eslint-disable-next-line max-len
            if (getUniqueIdFromComponent(componentDetail) !== getUniqueIdFromComponent(prevComponentDetail)) {
                const componentDetailDeepClone = clone(componentDetail);
                if (componentDetailDeepClone) {
                    const matchingComponentType = matchComponentType(this.props.state, componentDetailDeepClone);
                    const orderedComponentParameters = orderComponentParameters(
                        componentDetailDeepClone.parameters, matchingComponentType,
                    );
                    // eslint-disable-next-line react/no-did-update-set-state
                    this.setState({
                        newComponentDetail: {
                            ...componentDetailDeepClone,
                            parameters: orderedComponentParameters,
                        },
                    });
                }
            }
        }

        private navigateToComponentAfterCreation(prevProps: TProps & IObserveProps) {
            const { newComponentDetail } = this.state;
            const { status } = getAsyncComponentDetail(this.props.state).create;
            const prevStatus = getAsyncComponentDetail(prevProps.state).create.status;
            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                redirectTo({
                    routeKey: ROUTE_KEYS.R_COMPONENT_DETAIL,
                    params: {
                        name: newComponentDetail.name,
                        version: this.isCreateComponentRoute()
                            ? newComponentDetail.version.number
                            : newComponentDetail.version.number + 1,
                    },
                });
            }
        }

        private navigateToComponentAfterDeletion(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncComponentDetail(this.props.state).remove;
            const prevStatus = getAsyncComponentDetail(prevProps.state).remove.status;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                redirectTo({
                    routeKey: ROUTE_KEYS.R_COMPONENTS,
                });
            }
        }
    },
);

function getParametersFromComponentDetails(detail: IComponent, componentType: IComponentType) {
    const parameters = detail
        ? detail.parameters
            .map((parameter) => ({
                name: parameter.name,
                value: parameter.value,
                mandatory: componentType
                    ? componentType.parameters
                        .some((type) => type.name === parameter.name && type.mandatory === true)
                    : false,
            }))
        : [];
    const newListItems: IListItem<IComponentParameter>[] = parameters.map((parameter, index) => ({
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

function orderComponentParameters(items: IComponentParameter[], componentType: IComponentType) {
    const parameters = items
        ? items
            .map((parameter) => ({
                name: parameter.name,
                value: parameter.value,
                mandatory: componentType
                    ? componentType.parameters
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
    const orderedParameters: IComponentParameter[] = mandatoryParameters
        .concat(nonMandatoryParameters)
        .map((p) => ({
            name: p.name,
            value: p.value,
        }));
    return orderedParameters;
}

function matchComponentType(state: IState, component: IComponent) {
    const componentTypes = getAsyncComponentTypes(state).data || [];
    const matchingComponentType = componentTypes
        .find((item) => item.type === component?.type);
    return matchingComponentType;
}

export default observe([
    StateChangeNotification.DESIGN_COMPONENT_DETAIL,
    StateChangeNotification.CONSTANTS_COMPONENT_TYPES,
], withRouter(ComponentDetail));
