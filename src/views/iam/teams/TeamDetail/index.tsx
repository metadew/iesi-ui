import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IObserveProps, observe } from 'views/observe';
import {
    Box,
    Button,
    Collapse,
    createStyles,
    Typography,
    WithStyles,
    withStyles,
} from '@material-ui/core';
import { Add, Edit, Visibility } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import {
    ITeam,
    ITeamBase,
    ITeamPost,
    ITeamRole,
    ITeamRoleUser,
    ITeamUserColumnNames,
} from 'models/state/team.model';
import { getRouteKeyByPath, redirectTo, ROUTE_KEYS } from 'views/routes';
import { StateChangeNotification } from 'models/state.models';
import { getAsyncTeamDetail, getAsyncTeamDetailSecurityGroup } from 'state/entities/teams/selectors';
import { getAsyncUserDetailRole } from 'state/entities/users/selectors';
import {
    triggerAssignTeamToSecurityGroup,
    triggerCreateTeamDetail,
    triggerDeleteTeamDetail,
    triggerUnassignTeamToSecurityGroup,
} from 'state/entities/teams/triggers';
import { getUniqueIdFromTeam } from 'utils/teams/teamUtils';
import { clone } from 'lodash';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import { checkAuthorityGeneral } from 'state/auth/selectors';
import Loader from 'views/common/waiting/Loader';
import requiredFieldsCheck from 'utils/form/requiredFieldsCheck';
import { TRequiredFieldsState } from 'models/form.models';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getTranslator } from 'state/i18n/selectors';
import TextInput from 'views/common/input/TextInput';
import DescriptionList from 'views/common/list/DescriptionList';
import GenericList from 'views/common/list/GenericList';
import { IListItem, ListColumns } from 'models/list.models';
import OrderedList from 'views/common/list/OrderedList';
import { IUser } from 'models/state/user.model';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
import AddUser from '../AddUser';
import EditSecurityGroups from './EditSecurityGroups';
import DetailActions from './DetailActions';

const styles = () => createStyles({});

type TProps = WithStyles<typeof styles>;

interface IComponentState {
    newTeamDetail: ITeamBase | ITeamPost;
    users: ITeamRoleUser[];
    selectedSecurityGroupIndex: number;
    securityGroupIdToDelete: string;
    hasChangeToCheck: boolean;
    isSaveDialogOpen: boolean;
    isAddOpen: boolean;
    isConfirmDeleteTeamOpen: boolean;
    requiredFieldsState: TRequiredFieldsState<ITeamPost>;
}

const initialTeamDetail: ITeam = {
    teamName: '',
    securityGroups: [],
    roles: [],
};

const initialTeamPostDetail: ITeamPost = {
    teamName: '',
};

const TeamDetail = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps & RouteComponentProps, IComponentState> {
        public constructor(
            props: TProps & IObserveProps & RouteComponentProps,
        ) {
            super(props);

            this.state = {
                newTeamDetail: this.isCreateRoute()
                    ? initialTeamPostDetail
                    : initialTeamDetail,
                users: [],
                selectedSecurityGroupIndex: -1,
                securityGroupIdToDelete: null,
                hasChangeToCheck: false,
                isAddOpen: false,
                isSaveDialogOpen: false,
                isConfirmDeleteTeamOpen: false,
                requiredFieldsState: {
                    teamName: {
                        showError: false,
                    },
                },
            };

            this.updateTeamInStateIfNewTeamWasLoaded = this.updateTeamInStateIfNewTeamWasLoaded.bind(this);
            // eslint-disable-next-line max-len
            this.updateTeamSecurityGroupIfNewSecurityGroupIsAdded = this.updateTeamSecurityGroupIfNewSecurityGroupIsAdded.bind(this);
            // eslint-disable-next-line max-len
            this.updateTeamSecurityGroupIfNewSecurityGroupIsRemoved = this.updateTeamSecurityGroupIfNewSecurityGroupIsRemoved.bind(this);
            this.navigateToTeamAfterCreation = this.navigateToTeamAfterCreation.bind(this);
            this.navigateToTeamsAfterDeletation = this.navigateToTeamsAfterDeletation.bind(this);
            this.closeAddRoleDialogAFterAddingUser = this.closeAddRoleDialogAFterAddingUser.bind(this);

            this.renderTeamDetailPanel = this.renderTeamDetailPanel.bind(this);
            this.renderTeamDetailContent = this.renderTeamDetailContent.bind(this);

            this.renderAddUser = this.renderAddUser.bind(this);

            this.onDeleteTeam = this.onDeleteTeam.bind(this);
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            this.updateTeamInStateIfNewTeamWasLoaded(prevProps);
            this.updateTeamSecurityGroupIfNewSecurityGroupIsAdded(prevProps);
            this.updateTeamSecurityGroupIfNewSecurityGroupIsRemoved(prevProps);
            this.closeAddRoleDialogAFterAddingUser(prevProps);
            this.navigateToTeamAfterCreation(prevProps);
            this.navigateToTeamsAfterDeletation(prevProps);
        }

        public render() {
            const { state } = this.props;
            const {
                isAddOpen,
                isSaveDialogOpen,
                newTeamDetail,
                isConfirmDeleteTeamOpen,
            } = this.state;
            const teamDetailAsyncStatus = getAsyncTeamDetail(state).fetch.status;
            const teamDetailAsyncDeleteStatus = getAsyncTeamDetail(state).remove.status;
            const teamSecurityGroupCreateStatus = getAsyncTeamDetailSecurityGroup(state).create.status;
            const teamSecurityGroupRemoveStatus = getAsyncTeamDetailSecurityGroup(state).remove.status;
            const teamAssignUserRoleCreateStatus = getAsyncUserDetailRole(state).create.status;
            const translator = getTranslator(state);

            return (
                <>
                    <Loader
                        show={
                            teamDetailAsyncStatus === AsyncStatus.Busy
                            || teamSecurityGroupCreateStatus === AsyncStatus.Busy
                            || teamSecurityGroupRemoveStatus === AsyncStatus.Busy
                            || teamAssignUserRoleCreateStatus === AsyncStatus.Busy

                        }
                    />
                    <ContentWithSidePanel
                        panel={this.renderTeamDetailPanel()}
                        content={this.renderTeamDetailContent()}
                        contentOverlay={this.renderAddUser()}
                        contentOverlayOpen={isAddOpen}
                        toggleLabel={
                            <Translate msg="teams.detail.side.toggle_button" />
                        }
                        goBackTo={ROUTE_KEYS.R_TEAMS}
                    />
                    <ConfirmationDialog
                        title={translator('teams.detail.delete_team_dialog.title')}
                        text={translator('teams.detail.delete_team_dialog.text')}
                        open={isConfirmDeleteTeamOpen}
                        onClose={() => this.setState({ isConfirmDeleteTeamOpen: false })}
                        onConfirm={this.onDeleteTeam}
                        showLoader={teamDetailAsyncDeleteStatus === AsyncStatus.Busy}
                    />
                    <ClosableDialog
                        title={translator('teams.detail.save_team_dialog.title')}
                        open={isSaveDialogOpen}
                        onClose={() => this.setState({ isSaveDialogOpen: false })}
                    >
                        <Typography>
                            <Translate
                                msg="teams.detail.save_team_dialog.text"
                                placeholders={{
                                    name: newTeamDetail.teamName,
                                }}
                            />
                        </Typography>
                        <Box display="flex" alignItems="center" justifyContent="center" marginTop={2}>
                            <Box paddingRight={1}>
                                <Button
                                    id="save-team"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() =>
                                        triggerCreateTeamDetail(newTeamDetail as ITeamPost)}
                                >
                                    <Translate msg="teams.detail.save_team_dialog.create" />
                                </Button>
                            </Box>
                        </Box>
                    </ClosableDialog>
                </>
            );
        }

        private renderTeamDetailPanel() {
            const { state } = this.props;
            const {
                newTeamDetail,
                selectedSecurityGroupIndex,
                requiredFieldsState,
            } = this.state;
            const translator = getTranslator(state);

            return (
                <Box
                    mt={1}
                    display="flex"
                    flexDirection="column"
                    flex="1 1 auto"
                >
                    <Box flex="1 1 auto">
                        <form noValidate autoComplete="off">
                            <TextInput
                                id="team-name"
                                label={translator(
                                    'teams.detail.side.team_name',
                                )}
                                InputProps={{
                                    readOnly: !this.isCreateRoute() && newTeamDetail !== undefined,
                                    disableUnderline: true,
                                }}
                                value={newTeamDetail.teamName}
                                onChange={(e) => this.updateTeam({
                                    teamName: e.target.value,
                                })}
                                error={requiredFieldsState.teamName.showError}
                                helperText={requiredFieldsState.teamName.showError
                                    && 'The team name is a required field'}
                            />
                            {
                                !this.isCreateRoute() && (
                                    <DescriptionList
                                        noLineAfterListItem
                                        items={[].concat({
                                            label: (
                                                <Translate msg="teams.detail.side.security_groups.title" />
                                            ),
                                            value: (
                                                <EditSecurityGroups
                                                    teamSecurityGroups={newTeamDetail
                                                        && (newTeamDetail as ITeamBase).securityGroups}
                                                    selectedIndex={selectedSecurityGroupIndex}
                                                    onSecurityGroupSelected={(index) => {
                                                        this.setState({
                                                            selectedSecurityGroupIndex:
                                                                index,
                                                        });
                                                    }}
                                                    onSubmit={(newSecurityGroup) => {
                                                        triggerAssignTeamToSecurityGroup({
                                                            id: newSecurityGroup.id,
                                                            teamId: (newTeamDetail as ITeamBase).id,
                                                        });
                                                    }}
                                                    onDelete={(id) => {
                                                        this.setState({ securityGroupIdToDelete: id });
                                                        triggerUnassignTeamToSecurityGroup({
                                                            id,
                                                            teamId: (newTeamDetail as ITeamBase).id,
                                                        });
                                                    }}
                                                    isCreateTeamRoute={this.isCreateRoute()}
                                                />
                                            ),
                                        })}
                                    />
                                )
                            }
                        </form>
                    </Box>
                </Box>
            );
        }

        private renderTeamDetailContent() {
            const { state } = this.props;
            const { newTeamDetail, users, hasChangeToCheck } = this.state;
            const translator = getTranslator(state);
            const userItems = mapUserToListItems(users, (newTeamDetail as ITeamBase));
            const hasUsers = userItems.length > 0;

            const handleSaveAction = () => {
                if (this.isCreateRoute()) {
                    const { passed: passedRequired, requiredFieldsState } = requiredFieldsCheck<ITeamPost>({
                        data: newTeamDetail as ITeamPost,
                        requiredFields: ['teamName'],
                    });

                    if (passedRequired) {
                        this.setState({
                            isSaveDialogOpen: true,
                            requiredFieldsState,
                            hasChangeToCheck: false,
                        });
                    } else {
                        this.setState({
                            requiredFieldsState,
                        });
                    }
                }
            };

            const userColumns: ListColumns<Partial<ITeamUserColumnNames>> = {
                username: {
                    label: (
                        <Translate msg="teams.detail.main.list.item.labels.username" />
                    ),
                    fixedWidth: '70%',
                },
                enabled: {
                    label: (
                        <Translate msg="teams.detail.main.list.item.labels.enabled" />
                    ),
                    fixedWidth: '5%',
                },
                credentialsExpired: {
                    label: (
                        <Translate msg="teams.detail.main.list.item.labels.credentialsExpired" />
                    ),
                    fixedWidth: '5%',
                },
                expired: {
                    label: (
                        <Translate msg="teams.detail.main.list.item.labels.expired" />
                    ),
                    fixedWidth: '5%',
                },
                locked: {
                    label: (
                        <Translate msg="teams.detail.main.list.item.labels.locked" />
                    ),
                    fixedWidth: '5%',
                },
                role: {
                    label: (
                        <Translate msg="teams.detail.main.list.item.labels.roles" />
                    ),
                    fixedWidth: '10%',
                },
            };

            if (!hasUsers && !this.isCreateRoute()) {
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
                                <Translate msg="teams.detail.main.no_users.title" />
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<Add />}
                                onClick={() => this.setState({ isAddOpen: true })}
                            >
                                <Translate msg="teams.detail.main.no_users.button" />
                            </Button>
                        </Box>
                    </Box>
                );
            }

            return (
                <>
                    <Box>
                        <Collapse in={hasChangeToCheck}>
                            <Box marginX={2} marginBottom={2}>
                                <Alert severity="warning">
                                    <Translate msg="teams.detail.main.alert.save_changes" />
                                </Alert>
                            </Box>
                        </Collapse>
                        <DetailActions
                            onSave={handleSaveAction}
                            onAdd={() => this.setState({ isAddOpen: true })}
                            onDelete={() => this.setState({ isConfirmDeleteTeamOpen: true })}
                            isCreateRoute={this.isCreateRoute()}
                        />
                    </Box>
                    {!this.isCreateRoute() && (
                        <Box marginY={1}>
                            <GenericList
                                listItems={userItems}
                                columns={userColumns}
                                listActions={[
                                    {
                                        icon: <Edit />,
                                        label: translator(
                                            'teams.detail.main.list.item.actions.edit',
                                        ),
                                        onClick: (id, index) => redirectTo({
                                            routeKey: ROUTE_KEYS.R_USER_DETAIL,
                                            params: {
                                                name: users[index].username,
                                            },
                                            queryParams: {
                                                teamName: (newTeamDetail as ITeamBase).teamName,
                                            },
                                        }),
                                        hideAction: () =>
                                            !checkAuthorityGeneral(
                                                state,
                                                SECURITY_PRIVILEGES.S_USERS_WRITE,
                                            ),
                                    }, {
                                        icon: <Visibility />,
                                        label: translator('teams.detail.main.list.item.actions.view'),
                                        onClick: (id, index) => redirectTo({
                                            routeKey: ROUTE_KEYS.R_USER_DETAIL,
                                            params: {
                                                name: users[index].username,
                                            },
                                            queryParams: {
                                                teamName: (newTeamDetail as ITeamBase).teamName,
                                            },
                                        }),
                                        hideAction: () =>
                                            checkAuthorityGeneral(
                                                state,
                                                SECURITY_PRIVILEGES.S_USERS_WRITE,
                                            ) || !checkAuthorityGeneral(
                                                state,
                                                SECURITY_PRIVILEGES.S_USERS_READ,
                                            ),
                                    },
                                ]}
                            />
                        </Box>
                    )}
                </>
            );
        }

        private renderAddUser() {
            const {
                newTeamDetail,
            } = this.state;
            return (
                <AddUser
                    onClose={() => this.setState({ isAddOpen: false })}
                    onAdd={(chosenUser: IUser, roleChosen: ITeamRole) => {
                        const userTeamRole: ITeamRoleUser = {
                            id: chosenUser.id,
                            username: chosenUser.username,
                            enabled: chosenUser.enabled,
                            credentialsExpired: chosenUser.credentialsExpired,
                            expired: chosenUser.expired,
                            locked: chosenUser.locked,
                        };
                        this.updateTeam({
                            roles: (newTeamDetail as ITeamBase).roles.map((teamRole) => {
                                if (teamRole.id === roleChosen.id) {
                                    return {
                                        ...teamRole,
                                        users: [...teamRole.users, userTeamRole],
                                    };
                                }
                                return teamRole;
                            }),
                        });
                        if (!this.state.users.find((user) => user.id === chosenUser.id)) {
                            this.setState((prevState) => ({
                                users: [...prevState.users, userTeamRole],
                            }));
                        }
                    }}
                    team={(newTeamDetail as ITeamBase)}
                />
            );
        }

        private onDeleteTeam() {
            const { state } = this.props;
            const detail = getAsyncTeamDetail(state).data;
            if (detail) {
                triggerDeleteTeamDetail({ id: detail.id });
            }
        }

        private updateTeam(fieldsToUpdate: Partial<ITeamPost | ITeam>) {
            this.setState((prevState) => ({
                newTeamDetail: {
                    ...prevState.newTeamDetail,
                    ...fieldsToUpdate,
                },
            }));
        }

        private navigateToTeamsAfterDeletation(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncTeamDetail(this.props.state).remove;
            const { status: prevStatus } = getAsyncTeamDetail(prevProps.state).remove;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                redirectTo({
                    routeKey: ROUTE_KEYS.R_TEAMS,
                });
            }
        }

        private navigateToTeamAfterCreation(prevProps: TProps & IObserveProps) {
            const { newTeamDetail } = this.state;
            const { status } = getAsyncTeamDetail(this.props.state).create;
            const { status: prevStatus } = getAsyncTeamDetail(
                prevProps.state,
            ).create;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                redirectTo({
                    routeKey: ROUTE_KEYS.R_TEAM_DETAIL,
                    params: {
                        name: newTeamDetail.teamName,
                    },
                });
            }
        }

        private updateTeamSecurityGroupIfNewSecurityGroupIsAdded(
            prevProps: TProps & IObserveProps,
        ) {
            const teamSecurityGroup = getAsyncTeamDetailSecurityGroup(this.props.state).data;
            const { newTeamDetail } = this.state;
            const { status } = getAsyncTeamDetailSecurityGroup(this.props.state).create;
            const { status: prevStatus } = getAsyncTeamDetailSecurityGroup(prevProps.state).create;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success && teamSecurityGroup) {
                this.updateTeam({
                    securityGroups: [
                        ...(
                            newTeamDetail as ITeamBase
                        ).securityGroups, {
                            id: teamSecurityGroup.id,
                            name: teamSecurityGroup.name,
                        },
                    ],
                });
            }
        }

        private updateTeamSecurityGroupIfNewSecurityGroupIsRemoved(
            prevProps: TProps & IObserveProps,
        ) {
            const { newTeamDetail, securityGroupIdToDelete } = this.state;
            const { status } = getAsyncTeamDetailSecurityGroup(this.props.state).remove;
            const { status: prevStatus } = getAsyncTeamDetailSecurityGroup(prevProps.state).remove;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                this.updateTeam({
                    securityGroups: (newTeamDetail as ITeamBase).securityGroups
                        .filter((securityGroup) => securityGroup.id !== securityGroupIdToDelete),
                });
            }
        }

        private closeAddRoleDialogAFterAddingUser(
            prevProps: TProps & IObserveProps,
        ) {
            const { status } = getAsyncUserDetailRole(this.props.state).create;
            const { status: prevStatus } = getAsyncUserDetailRole(prevProps.state).create;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                this.setState({ isAddOpen: false });
            }
        }

        private updateTeamInStateIfNewTeamWasLoaded(
            prevProps: TProps & IObserveProps,
        ) {
            const teamDetail = getAsyncTeamDetail(this.props.state).data;
            const prevTeamDetail = getAsyncTeamDetail(prevProps.state).data;

            if (getUniqueIdFromTeam(teamDetail) !== getUniqueIdFromTeam(prevTeamDetail) && teamDetail) {
                const teamDetailDeepClone = clone(teamDetail);
                this.setState({
                    newTeamDetail: teamDetailDeepClone,
                    users: teamDetailDeepClone.users,
                });
            }
        }

        private isCreateRoute() {
            const currentRouteKey = getRouteKeyByPath({
                path: this.props.match.path,
            });
            return currentRouteKey === ROUTE_KEYS.R_TEAM_NEW;
        }
    },
);

function mapUserToListItems(users: ITeamRoleUser[], team: ITeamBase) {
    /*
    team.roles.find((role) =>
                    role.users.find((userRole) => userRole.id === user.id)).name
    */
    const newListItems: IListItem<Partial<ITeamUserColumnNames>>[] = users ? (
        users.map((user) => {
            const userRoles = team.roles
                .flatMap((role) => (
                    role.users
                        .find((userRole) => userRole.id === user.id) ? [role.name] : []));
            return {
                id: user.id,
                columns: {
                    username: user.username,
                    enabled: user.enabled ? 'Yes' : 'No',
                    credentialsExpired: user.credentialsExpired ? 'Yes' : 'No',
                    expired: user.expired ? 'Yes' : 'No',
                    locked: user.locked ? 'Yes' : 'No',
                    role: {
                        value: userRoles.length,
                        tooltip: userRoles.length > 0 && (
                            <Typography variant="body2" component="div">
                                <OrderedList
                                    items={userRoles.map((userRole) => ({
                                        content: userRole,
                                    }))}
                                />
                            </Typography>
                        ),
                    },
                },
            };
        })
    ) : [];

    return newListItems;
}

export default observe([
    StateChangeNotification.I18N_TRANSLATIONS,
    StateChangeNotification.IAM_TEAMS_DETAIL,
    StateChangeNotification.IAM_TEAM_DETAIL_SECURITY_GROUP,
    StateChangeNotification.IAM_USER_DETAIL_ROLE,
], withRouter(TeamDetail));
