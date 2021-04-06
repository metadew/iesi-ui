import React from 'react';
import {
    Box,
    Button,
    createStyles,
    Theme,
    Typography,
    withStyles,
    WithStyles,
} from '@material-ui/core';
import { IObserveProps, observe } from 'views/observe';
import AppTemplateContainer from 'views/appShell/AppTemplateContainer';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { redirectTo, ROUTE_KEYS } from 'views/routes';
import GenericList from 'views/common/list/GenericList';
import { IListItem, ListColumns } from 'models/list.models';
import { IConnectionEntity, IConnectionColumnNames } from 'models/state/connections.model';
import { getUniqueIdFromConnection } from 'utils/connections/connectionUtils';
import { Add, Delete } from '@material-ui/icons';
import { getTranslator } from 'state/i18n/selectors';
import { getAsyncTransformResultEntity } from 'state/entities/openapi/selectors';
import { IComponentColumnNames, IComponentEntity } from 'models/state/components.model';
import { getUniqueIdFromComponent } from 'utils/components/componentUtils';
import {
    triggerCreateConnection,
} from 'state/entities/connections/triggers';
import {
    triggerCreateComponent,
} from 'state/entities/components/triggers';
import { deleteComponent, deleteConnection } from 'state/ui/actions';
import { StateChangeNotification } from 'models/state.models';

const styles = ({ palette, typography }: Theme) =>
    createStyles({
        header: {
            backgroundColor: palette.background.paper,
            borderBottom: '1px solid',
            borderBottomColor: palette.grey[200],
        },
        loadDocButton: {
            alignSelf: 'flex-end',
        },
        helperButton: {
            marginTop: 2,
            fontSize: typography.pxToRem(12),
            color: palette.grey[500],
        },
        listHeading: {
            fontWeight: 'bold',
        },
        saveAllButton: {
            marginLeft: 4,
        },
        nameCol: {
            backgroundColor: 'black',
        },
    });

interface IComponentState {
    isConnectionEditOpen: boolean;
}
type TProps = WithStyles<typeof styles>;

const OpenAPIOverview = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, IComponentState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);

            this.state = {
                isConnectionEditOpen: false,
            };

            this.renderConnectionContent = this.renderConnectionContent.bind(this);
            this.renderComponentContent = this.renderComponentContent.bind(this);
            this.onOpenDialog = this.onOpenDialog.bind(this);
            this.onCloseDialog = this.onCloseDialog.bind(this);
        }

        public componentDidMount() {
            if (!this.props.state.entities.openapi.data) {
                redirectTo({ routeKey: ROUTE_KEYS.R_HOME });
            }
        }

        public render() {
            const { classes, state } = this.props;
            const {
                title = '',
                version = '',
                connections = [],
                components = [],
            } = state.entities.openapi.data || {};
            const connectionsListItems = mapConnectionsToListItems(connections);
            const componentsListItems = mapComponentsToListItems(components);

            return (
                <Box height="100%" display="flex" flexDirection="column" flex="1 0 auto">
                    <Box
                        paddingTop={3}
                        paddingBottom={3}
                        className={classes.header}
                    >
                        <AppTemplateContainer>
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="space-between"
                            >
                                <Typography variant="h6">
                                    <Translate
                                        msg="doc.overview.openapi_title"
                                        placeholders={{ title }}
                                    />
                                </Typography>
                                <Typography variant="h6">
                                    <Translate
                                        msg="doc.overview.openapi_version"
                                        placeholders={{ version }}
                                    />
                                </Typography>
                                <Box display="flex" alignSelf="flex-end">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        className={classes.saveAllButton}
                                        onClick={() => {}}
                                    >
                                        Save All connections
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        className={classes.saveAllButton}
                                        onClick={() => {}}
                                    >
                                        Save All components
                                    </Button>
                                </Box>
                            </Box>

                        </AppTemplateContainer>
                    </Box>
                    <Box paddingBottom={5} margin={4}>
                        <Box
                            display="flex"
                            flexDirection="column"
                        >
                            <Box
                                display="flex"
                                flexDirection="column"
                                my={2}
                            >
                                <Box display="flex" alignItems="center">
                                    <Typography
                                        variant="h5"
                                        className={classes.listHeading}
                                    >
                                        <Translate
                                            msg="doc.overview.connection_header_amount"
                                            placeholders={{ amount: connections.length }}
                                        />
                                    </Typography>
                                </Box>
                                <Box display="flex" flexDirection="column" alignItems="flex-start">
                                    {this.renderConnectionContent({ listItems: connectionsListItems })}
                                </Box>

                            </Box>
                            <Box
                                display="flex"
                                flexDirection="column"
                                my={2}
                            >
                                <Box display="flex" alignItems="center">
                                    <Typography
                                        variant="h5"
                                        className={classes.listHeading}
                                    >
                                        <Translate
                                            msg="doc.overview.component_header_amount"
                                            placeholders={{ amount: components.length }}
                                        />
                                    </Typography>
                                </Box>

                                <Box display="flex" flexDirection="column" alignItems="flex-start">
                                    {this.renderComponentContent({ listItems: componentsListItems })}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            );
        }

        public renderConnectionContent({ listItems }: { listItems: IListItem<IConnectionColumnNames>[] }) {
            const { state } = this.props;
            const translator = getTranslator(state);
            const { connections = [] } = getAsyncTransformResultEntity(state).data || {};
            const columns: ListColumns<IConnectionColumnNames> = {
                name: {
                    fixedWidth: '35%',
                    label: <Translate msg="doc.overview.common_columns.name" />,
                },
                description: {
                    fixedWidth: '35%',
                    noWrap: true,
                    label: <Translate msg="doc.overview.common_columns.description" />,
                },
                host: {
                    fixedWidth: '35%',
                    label: <Translate msg="doc.overview.connection_columns.host" />,
                },
                baseUrl: {
                    fixedWidth: '35%',
                    label: <Translate msg="doc.overview.connection_columns.baseUrl" />,
                },
                tls: {
                    fixedWidth: '35%',
                    label: <Translate msg="doc.overview.connection_columns.tls" />,
                },
                environment: {
                    fixedWidth: '35%',
                    label: <Translate msg="doc.overview.connection_columns.environment" />,
                },
            };

            return (
                <GenericList
                    listActions={[
                        {
                            icon: <Add />,
                            label: translator('doc.overview.action_buttons.save'),
                            onClick: (_, index) => {
                                triggerCreateConnection(connections[index]);
                            },
                        },
                        {
                            icon: <Delete />,
                            label: translator('doc.overview.action_buttons.delete'),
                            onClick: (id) => this.props.dispatch(deleteConnection({ id })),
                        },
                    ]}
                    columns={columns}
                    listItems={listItems}
                />
            );
        }

        public renderComponentContent({ listItems }: { listItems: IListItem<IComponentColumnNames>[] }) {
            const { state } = this.props;
            const translator = getTranslator(state);
            const { components = [] } = getAsyncTransformResultEntity(state).data || {};
            const columns: ListColumns<IComponentColumnNames> = {
                name: {
                    fixedWidth: '20%',
                    label: <Translate msg="doc.overview.common_columns.name" />,
                },
                description: {
                    fixedWidth: '20%',
                    noWrap: true,
                    label: <Translate msg="doc.overview.common_columns.description" />,
                },
                version: {
                    fixedWidth: '5%',
                    label: <Translate msg="doc.overview.component_columns.version" />,
                },
                endpoint: {
                    fixedWidth: '10%',
                    label: <Translate msg="doc.overview.component_columns.endpoint" />,
                },
                type: {
                    fixedWidth: '8%',
                    label: <Translate msg="doc.overview.component_columns.type" />,
                },
                connection: {
                    fixedWidth: '50%',
                    label: <Translate msg="doc.overview.component_columns.connection" />,
                },
            };

            return (
                <GenericList
                    listActions={[
                        {
                            icon: <Add />,
                            label: translator('doc.overview.action_buttons.save'),
                            onClick: (_, index) => triggerCreateComponent(components[index]),
                        },
                        {
                            icon: <Delete />,
                            label: translator('doc.overview.action_buttons.delete'),
                            onClick: (id) => this.props.dispatch(deleteComponent({ id })),
                        },
                    ]}
                    columns={columns}
                    listItems={listItems}
                />
            );
        }

        public onOpenDialog() {
            this.setState((state) => ({ ...state, isDialogOpen: true }));
        }

        public onCloseDialog() {
            this.setState((state) => ({ ...state, isDialogOpen: true }));
        }
    },
);

function mapConnectionsToListItems(connections: IConnectionEntity[]): IListItem<IConnectionColumnNames>[] {
    return connections.map((connection) => ({
        id: getUniqueIdFromConnection(connection),
        columns: {
            name: connection.name,
            description: connection.description,
            host: connection.parameters[1].value,
            baseUrl: connection.parameters[0].value,
            tls: connection.parameters[2].value,
            environment: connection.environment,
        },
    }));
}

function mapComponentsToListItems(components: IComponentEntity[]): IListItem<IComponentColumnNames>[] {
    return components.map((component) => ({
        id: getUniqueIdFromComponent(component),
        columns: {
            name: component.name,
            description: component.description,
            version: component.version.number,
            endpoint: component.parameters[0].value,
            type: component.parameters[1].value,
            connection: component.parameters[2].value,
        },
    }));
}

export default observe<TProps>([
    StateChangeNotification.CONNECTION_DELETE,
    StateChangeNotification.COMPONENT_DELETE,
], OpenAPIOverview);
