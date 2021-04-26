import React from 'react';
import { Box, WithStyles, withStyles, createStyles, Collapse } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IComponent, IComponentParameter } from 'models/state/components.model';
import { IObserveProps, observe } from 'views/observe';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel';
import TextInput from 'views/common/input/TextInput';
import { getTranslator } from 'state/i18n/selectors';
import { getRouteKeyByPath, ROUTE_KEYS } from 'views/routes';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getAsyncComponentTypes } from 'state/entities/constants/selectors';
import { IComponentType } from 'models/state/constants.models';
import { IListItem, ListColumns } from 'models/list.models';
import { Alert, Autocomplete } from '@material-ui/lab';
import { StateChangeNotification } from 'models/state.models';
import GenericList from 'views/common/list/GenericList';
import DetailActions from '../ScriptDetail/DetailActions';
import EditParameter from './EditParameter';

const styles = (() => createStyles({
    root: {},
}));

type TProps = WithStyles<typeof styles>;

interface IComponentState {
    newComponentDetail: IComponent;
    parameterToEdit: IComponentParameter;
    hasChangesToCheck: false;
}

interface IColumnNames {
    name: string;
    type: string;
}

interface IListData {
    type: string;
}

const componentTypeParameters: { [key: string]: IComponentParameter[] } = {
    'http.request': [{
        name: 'endpoint',
        value: '',
    }, {
        name: 'type',
        value: '',
    }, {
        name: 'connection',
        value: '',
    }],
};

const ComponentDetail = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps & RouteComponentProps, IComponentState> {
        public constructor(props: TProps & IObserveProps & RouteComponentProps) {
            super(props);

            this.state = {
                newComponentDetail: {
                    type: '',
                    name: '',
                    description: '',
                    version: {
                        number: 1,
                        description: '',
                    },
                    parameters: componentTypeParameters['http.request'],
                    attributes: [],
                    isHandled: false,
                },
                hasChangesToCheck: false,
                parameterToEdit: null,
            };

            this.renderComponentDetailPanel = this.renderComponentDetailPanel.bind(this);
            this.renderComponentDetailContent = this.renderComponentDetailContent.bind(this);
            this.renderEditParameterContent = this.renderEditParameterContent.bind(this);
            this.isCreateComponentRoute = this.isCreateComponentRoute.bind(this);
        }

        public render() {
            const { parameterToEdit } = this.state;
            return (
                <>
                    <ContentWithSidePanel
                        panel={this.renderComponentDetailPanel}
                        content={this.renderComponentDetailContent}
                        goBackTo={ROUTE_KEYS.R_COMPONENTS}
                        contentOverlay={this.renderEditParameterContent()}
                        contentOverlayOpen={Boolean(parameterToEdit)}
                        toggleLabel={<Translate msg="components.detail.side.toggle_button" />}
                    />
                </>
            );
        }

        private renderComponentDetailPanel() {
            const { newComponentDetail } = this.state;
            const { state } = this.props;
            const translator = getTranslator(state);
            const componentTypes = getAsyncComponentTypes(state).data || [];
            const listItems = mapComponentTypeToListItems(componentTypes);
            return (
                <Box mt={1} display="flex" flexDirection="column" flex="1 1 auto">
                    <Box flex="1 1 auto">
                        <form noValidate autoComplete="off">
                            <Autocomplete
                                id="combo-box-component-types"
                                options={listItems}
                                getOptionLabel={(option) => option.data.type}
                                renderInput={(params) => (
                                    <TextInput
                                        {...params}
                                        label={translator('components.detail.side.component_type')}
                                        variant="filled"
                                    />
                                )}
                            />
                            <TextInput
                                id="component-name"
                                label={translator('components.detail.side.component_name')}
                                InputProps={{
                                    readOnly: !this.isCreateComponentRoute && newComponentDetail !== undefined,
                                    disableUnderline: true,
                                }}
                            />
                            <TextInput
                                id="component-description"
                                label={translator('components.detail.side.component_description')}
                                multiline
                                rows={8}
                                InputProps={{
                                    readOnly: !this.isCreateComponentRoute && newComponentDetail !== undefined,
                                    disableUnderline: true,
                                }}
                            />
                            {
                                this.isCreateComponentRoute() && (
                                    <TextInput
                                        id="component-version"
                                        label={translator('components.detail.side.component_version')}
                                        type="number"
                                        InputProps={{
                                            disableUnderline: true,
                                            inputProps: {
                                                min: 0,
                                            },
                                        }}
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
            const parameters = getComponentParameters(newComponentDetail.parameters);
            const translator = getTranslator(state);
            const columns: ListColumns<IComponentParameter> = {
                name: {
                    label: <Translate msg="components.detail.main.list.labels.name" />,
                    fixedWidth: '50%',
                },
                value: {
                    label: <Translate msg="components.detail.main.list.labels.value" />,
                    fixedWidth: '50%',
                },
            };
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
                            onSave={() => { }}
                            onDelete={() => { }}
                            isCreateRoute={this.isCreateComponentRoute()}
                        />
                    </Box>
                    <Box marginY={1}>
                        <GenericList
                            listItems={parameters}
                            columns={columns}
                            listActions={[{
                                icon: <Edit />,
                                label: translator('components.detail.main.list.actions.edit'),
                                onClick: (_, index) => {
                                    this.setState({ parameterToEdit: newComponentDetail.parameters[index] });
                                },
                            }, {
                                icon: <Delete />,
                                label: translator('components.detail.main.list.actions.edit'),
                                onClick: () => { },
                            }]}
                        />
                    </Box>
                </>
            );
        }

        private renderEditParameterContent() {
            const { parameterToEdit } = this.state;
            return (
                <EditParameter
                    onClose={() => this.setState({ parameterToEdit: null })}
                    parameter={parameterToEdit}
                    onEdit={(newParameter) => {
                        this.setState((prevState) => ({
                            newComponentDetail: {
                                ...prevState.newComponentDetail,
                                parameters: prevState.newComponentDetail.parameters
                                    .map((parameter) => {
                                        if (parameter.name === newParameter.name) {
                                            return newParameter;
                                        }
                                        return parameter;
                                    }),
                            },
                        }));
                    }}
                    isCreateComponentRoute={this.isCreateComponentRoute()}
                />
            );
        }

        private isCreateComponentRoute() {
            const currentRouteKey = getRouteKeyByPath({ path: this.props.match.path });
            return currentRouteKey === ROUTE_KEYS.R_COMPONENT_NEW;
        }
    },
);

function mapComponentTypeToListItems(items: IComponentType[]) {
    return items.map((item) => {
        const listItem: IListItem<IColumnNames, IListData> = {
            id: item.type,
            columns: {
                name: item.name,
                type: item.type,
            },
            data: {
                type: item.type,
            },
        };
        return listItem;
    });
}

function getComponentParameters(parameters: IComponentParameter[]) {
    const newListItems: IListItem<IComponentParameter>[] = parameters
        ? parameters.map((parameter, index) => ({
            id: index,
            columns: {
                name: parameter.name,
                value: parameter.value,
            },
            data: {
                name: parameter.name,
                value: parameter.value,
            },
        }))
        : [];
    return newListItems;
}

export default observe([StateChangeNotification.CONSTANTS_COMPONENT_TYPES], withRouter(ComponentDetail));
