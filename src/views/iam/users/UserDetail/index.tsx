import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { IObserveProps, observe } from 'views/observe';
import {
    Box,
    Button,
    Collapse,
    createStyles,
    IconButton,
    InputAdornment,
    Typography,
    WithStyles,
    withStyles,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Add, Delete, Visibility, VisibilityOff } from '@material-ui/icons';
import { IUser, IUserBase, IUserPost, IUserRole, IUserTeam } from 'models/state/user.model';
import { getAsyncUserDetail, getAsyncUserDetailRole } from 'state/entities/users/selectors';
import { ITeamRole } from 'models/state/team.model';
import { getUniqueIdFromUser } from 'utils/users/userUtils';
import Loader from 'views/common/waiting/Loader';
import requiredFieldsCheck from 'utils/form/requiredFieldsCheck';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
import { triggerCreateUserDetail, triggerDeleteUserRole, triggerUpdateUserDetail } from 'state/entities/users/triggers';
import { checkAuthority } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import { clone } from 'ramda';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { getRouteKeyByPath, redirectTo, ROUTE_KEYS } from 'views/routes';
import { StateChangeNotification } from 'models/state.models';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel';
import { TRequiredFieldsState } from 'models/form.models';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getTranslator } from 'state/i18n/selectors';
import TextInput from 'views/common/input/TextInput';
import DescriptionList from 'views/common/list/DescriptionList';
import GenericList from 'views/common/list/GenericList';
import { IListItem, ListColumns } from 'models/list.models';
import UpdatePasswordDialog from 'views/iam/users/UserDetail/UpdatePasswordDialog';
import DetailActions from '../DetailActions';
import EditTeams from './EditTeams';
import AddRole from './AddRole';

const styles = () => createStyles({});

type TProps = WithStyles<typeof styles>;

interface IComponentState {
    newUserDetail: IUserBase | IUserPost;
    teams: IUserTeam[];
    selectedTeamIndex: number;
    roleIndexToEdit: number;
    roleIndexToDelete: number;
    roleToAdd: ITeamRole;
    hasChangeToCheck: boolean;
    isAddOpen: boolean;
    isSaveDialogOpen: boolean;
    isConfirmDeleteUserOpen: boolean;
    isSaveTeamDialogOpen: boolean;
    isUpdatePasswordDialogOpen: boolean;
    isShowPassword: boolean;
    requiredFieldsState: TRequiredFieldsState<IUserPost>;
}

const initialUserDetail: IUser = {
    username: '',
    enabled: false,
    expired: false,
    credentialsExpired: false,
    locked: false,
    roles: [],
};

const initialUserPostDetail: IUserPost = {
    username: '',
    password: '',
    repeatedPassword: '',
};

const UserDetail = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps & RouteComponentProps, IComponentState> {
        public constructor(props: TProps & IObserveProps & RouteComponentProps) {
            super(props);

            this.state = {
                newUserDetail: this.isCreateUserRoute() ? initialUserPostDetail : initialUserDetail,
                teams: [],
                selectedTeamIndex: 0,
                roleIndexToEdit: null,
                roleIndexToDelete: null,
                roleToAdd: null,
                hasChangeToCheck: false,
                isAddOpen: false,
                isSaveDialogOpen: false,
                isConfirmDeleteUserOpen: false,
                isSaveTeamDialogOpen: false,
                isUpdatePasswordDialogOpen: false,
                isShowPassword: false,
                requiredFieldsState: {
                    username: {
                        showError: false,
                    },
                    password: {
                        showError: false,
                    },
                    repeatedPassword: {
                        showError: false,
                    },
                },
            };

            this.renderUserDetailPanel = this.renderUserDetailPanel.bind(this);
            this.renderUserDetailContent = this.renderUserDetailContent.bind(this);
            this.renderAddRole = this.renderAddRole.bind(this);

            this.updateUserInStateIfNewUserWasLoaded = this.updateUserInStateIfNewUserWasLoaded.bind(this);
            this.navigateToUserAfterCreation = this.navigateToUserAfterCreation.bind(this);
            this.navigateToUserAfterUpdate = this.navigateToUserAfterUpdate.bind(this);
            this.navigateToUsersAfterDeletion = this.navigateToUsersAfterDeletion.bind(this);
            this.reloadPageAfterRoleAssignment = this.reloadPageAfterRoleAssignment.bind(this);
            this.reloadPageAfterRoleDeletion = this.reloadPageAfterRoleDeletion.bind(this);

            this.onAddRole = this.onAddRole.bind(this);
            this.onDeleteRole = this.onDeleteRole.bind(this);
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            this.updateUserInStateIfNewUserWasLoaded(prevProps);
            this.navigateToUserAfterCreation(prevProps);
            this.navigateToUserAfterUpdate(prevProps);
            this.reloadPageAfterRoleAssignment(prevProps);
            this.reloadPageAfterRoleDeletion(prevProps);
        }

        public render() {
            const { state } = this.props;
            const {
                newUserDetail,
                isSaveDialogOpen,
                isUpdatePasswordDialogOpen,
                roleIndexToDelete,
                teams,
                selectedTeamIndex,
                isAddOpen,
            } = this.state;
            const translator = getTranslator(state);
            const roleItems = mapRoleToListItems(teams[selectedTeamIndex], (newUserDetail as IUser).roles);
            const userDetailAsyncStatus = getAsyncUserDetail(state).fetch.status;
            const userDetailRoleDeleteStatus = getAsyncUserDetailRole(state).remove.status;
            const userDetailRoleAssignStatus = getAsyncUserDetailRole(state).create.status;

            return (
                <>
                    <Loader
                        show={
                            userDetailAsyncStatus === AsyncStatus.Busy
                            || userDetailRoleDeleteStatus === AsyncStatus.Busy
                            || userDetailRoleAssignStatus === AsyncStatus.Busy
                        }
                    />
                    <ContentWithSidePanel
                        panel={this.renderUserDetailPanel()}
                        content={this.renderUserDetailContent()}
                        contentOverlay={teams[selectedTeamIndex] && selectedTeamIndex > -1 && this.renderAddRole()}
                        contentOverlayOpen={isAddOpen}
                        toggleLabel={<Translate msg="users.detail.side.toggle_button" />}
                        goBackTo={ROUTE_KEYS.R_USERS}
                    />
                    {
                        isUpdatePasswordDialogOpen && (
                            <UpdatePasswordDialog
                                id={(newUserDetail as IUser).id}
                                onClose={() => this.setState({ isUpdatePasswordDialogOpen: false })}
                            />
                        )
                    }
                    <ConfirmationDialog
                        title={translator('users.detail.main.delete_role_dialog.title')}
                        text={translator({
                            msg: 'users.detail.main.delete_role_dialog.text',
                            placeholders: {
                                role: roleItems[roleIndexToDelete]?.data.name || '',
                            },
                        })}
                        open={roleIndexToDelete !== null}
                        onClose={() => this.setState({ roleIndexToDelete: null })}
                        onConfirm={() => triggerDeleteUserRole({
                            id: teams[selectedTeamIndex].id,
                            roleId: roleItems[roleIndexToDelete].id.toString(),
                            userId: (newUserDetail as IUser).id,
                        })}
                    />
                    <ClosableDialog
                        title={translator('users.detail.save_user_dialog.title')}
                        open={isSaveDialogOpen}
                        onClose={() => this.setState({ isSaveDialogOpen: false })}
                    >
                        <Typography>
                            {
                                this.isCreateUserRoute() ? (
                                    <Translate
                                        msg="users.detail.save_user_dialog.text_save"
                                        placeholders={{
                                            username: newUserDetail.username,
                                        }}
                                    />
                                ) : (
                                    <Translate
                                        msg="users.detail.save_user_dialog.text_update"
                                        placeholders={{
                                            username: newUserDetail.username,
                                        }}
                                    />
                                )
                            }
                        </Typography>
                        <Box display="flex" alignItems="center" justifyContent="center" marginTop={2}>
                            <Box paddingRight={1}>
                                {
                                    this.isCreateUserRoute() ? (
                                        <Button
                                            id="save-user"
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => {
                                                triggerCreateUserDetail(newUserDetail as IUserPost);
                                                this.setState({ isSaveDialogOpen: false });
                                            }}
                                        >
                                            <Translate msg="users.detail.save_user_dialog.create" />
                                        </Button>
                                    ) : (
                                        <Button
                                            id="save-user"
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => triggerUpdateUserDetail(newUserDetail as IUserBase)}

                                        >
                                            <Translate msg="users.detail.save_user_dialog.update" />
                                        </Button>
                                    )
                                }

                            </Box>
                        </Box>
                    </ClosableDialog>
                </>
            );
        }

        private renderUserDetailPanel() {
            const { state } = this.props;
            const { newUserDetail, teams, requiredFieldsState, selectedTeamIndex, isShowPassword } = this.state;
            const translator = getTranslator(state);

            return (
                <Box mt={1} display="flex" flexDirection="column" flex="1 1 auto">
                    <Box flex="1 1 auto">
                        <form noValidate autoComplete="off">
                            <TextInput
                                id="user-name"
                                label={translator('users.detail.side.user_name')}
                                InputProps={{
                                    disableUnderline: true,
                                }}
                                value={newUserDetail.username}
                                onChange={(e) => this.updateUser({ username: e.target.value })}
                                required={this.isCreateUserRoute()}
                                error={requiredFieldsState.username.showError}
                                helperText={requiredFieldsState.username.showError && 'Username is a required field'}
                                autoComplete="username"
                            />
                            {
                                this.isCreateUserRoute() ? (
                                    <>
                                        <TextInput
                                            id="user-password"
                                            label={translator('users.detail.side.user_password')}
                                            type={isShowPassword ? 'text' : 'password'}
                                            value={newUserDetail && (newUserDetail as IUserPost).password}
                                            onChange={(e) => this.updateUser({ password: e.target.value })}
                                            error={requiredFieldsState.password.showError}
                                            // eslint-disable-next-line max-len
                                            helperText={requiredFieldsState.password.showError && 'User password is a required field'}
                                            autoComplete="new-password"
                                            InputProps={{
                                                disableUnderline: true,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() => {
                                                                this.setState({ isShowPassword: !isShowPassword });
                                                            }}
                                                            onMouseDown={(e) => e.preventDefault}
                                                        >
                                                            {
                                                                isShowPassword ? (
                                                                    <Visibility />
                                                                ) : (
                                                                    <VisibilityOff />
                                                                )
                                                            }
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            required
                                        />
                                        <TextInput
                                            id="user-repeat-password"
                                            label={translator('users.detail.side.user_repeated_password')}
                                            type={isShowPassword ? 'text' : 'password'}
                                            value={newUserDetail && (newUserDetail as IUserPost).repeatedPassword}
                                            onChange={(e) => this.updateUser({ repeatedPassword: e.target.value })}
                                            error={requiredFieldsState.repeatedPassword.showError}
                                            // eslint-disable-next-line max-len
                                            helperText={requiredFieldsState.repeatedPassword.showError && 'User password is a required field'}
                                            autoComplete="new-password"
                                            InputProps={{
                                                disableUnderline: true,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle repeated password visibility"
                                                            onClick={() => {
                                                                this.setState({ isShowPassword: !isShowPassword });
                                                            }}
                                                            onMouseDown={(e) => e.preventDefault}
                                                        >
                                                            {
                                                                isShowPassword ? (
                                                                    <Visibility />
                                                                ) : (
                                                                    <VisibilityOff />
                                                                )
                                                            }
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            required
                                        />
                                    </>
                                ) : (
                                    <>
                                        {
                                            checkAuthority(state, SECURITY_PRIVILEGES.S_USERS_WRITE) && (
                                                <Button
                                                    onClick={() => this.setState({ isUpdatePasswordDialogOpen: true })}
                                                >
                                                    <Typography>
                                                        <Translate msg="users.detail.side.update_password.button" />
                                                    </Typography>
                                                </Button>
                                            )
                                        }
                                        <DescriptionList
                                            noLineAfterListItem
                                            items={[].concat({
                                                label: <Translate msg="users.detail.side.teams.title" />,
                                                value: <EditTeams
                                                    userTeams={newUserDetail && teams}
                                                    selectedIndex={selectedTeamIndex}
                                                    // eslint-disable-next-line max-len
                                                    onTeamSelected={(index) => this.setState({ selectedTeamIndex: index })}
                                                    onSubmit={(newTeam) => {
                                                        this.setState({
                                                            teams: [
                                                                ...teams, {
                                                                    id: newTeam.id,
                                                                    name: newTeam.teamName,
                                                                    securityGroups: newTeam.securityGroups,
                                                                },
                                                            ],
                                                        });
                                                    }}
                                                    onDelete={() => { }}
                                                    isCreateUserRoute={this.isCreateUserRoute()}
                                                />,
                                            })}
                                        />
                                    </>
                                )
                            }
                        </form>
                    </Box>
                </Box>
            );
        }

        private renderUserDetailContent() {
            const { state } = this.props;
            const {
                newUserDetail,
                teams,
                selectedTeamIndex,
                hasChangeToCheck,
            } = this.state;
            const translator = getTranslator(state);
            const roleItems = mapRoleToListItems(teams[selectedTeamIndex], (newUserDetail as IUser).roles);
            const hasRoles = roleItems.length > 0;

            const handleSaveAction = () => {
                const { passed: passedRequired, requiredFieldsState } = requiredFieldsCheck<IUserPost>({
                    data: (newUserDetail as IUserPost),
                    requiredFields: ['username', 'password', 'repeatedPassword'],
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
            };

            const roleColumns: ListColumns<Partial<IUserRole>> = {
                name: {
                    label: <Translate msg="users.detail.main.list.item.labels.name" />,
                    fixedWidth: '20%',
                },
                privileges: {
                    label: <Translate msg="users.detail.main.list.item.labels.privileges" />,
                    fixedWidth: '80%',
                },
            };

            if (!teams.length && !this.isCreateUserRoute()) {
                return (
                    <>
                        <DetailActions
                            onSave={handleSaveAction}
                            onDelete={() => { }}
                            onAdd={null}
                            isCreateRoute={this.isCreateUserRoute()}
                        />
                        <Box
                            display="flex"
                            flexDirection="column"
                            flex="1 1 auto"
                            justifyContent="center"
                            paddingBottom={5}
                        >
                            <Box textAlign="center">
                                <Typography variant="h2" paragraph>
                                    <Translate msg="users.detail.main.no_teams.title" />
                                </Typography>
                            </Box>
                        </Box>
                    </>

                );
            }

            if (selectedTeamIndex === -1 && !this.isCreateUserRoute()) {
                return (
                    <>
                        <DetailActions
                            onSave={handleSaveAction}
                            onDelete={() => { }}
                            onAdd={null}
                            isCreateRoute={this.isCreateUserRoute()}
                        />
                        <Box
                            display="flex"
                            flexDirection="column"
                            flex="1 1 auto"
                            justifyContent="center"
                            paddingBottom={5}
                        >
                            <Box textAlign="center">
                                <Typography variant="h2" paragraph>
                                    <Translate msg="users.detail.main.no_chosen_team.title" />
                                </Typography>
                            </Box>
                        </Box>

                    </>

                );
            }

            if (!hasRoles && !this.isCreateUserRoute()) {
                return (
                    <>
                        <DetailActions
                            onSave={handleSaveAction}
                            onDelete={() => { }}
                            onAdd={() => this.setState({ isAddOpen: true })}
                            isCreateRoute={this.isCreateUserRoute()}
                        />
                        <Box
                            display="flex"
                            flexDirection="column"
                            flex="1 1 auto"
                            justifyContent="center"
                            paddingBottom={5}
                        >
                            <Box textAlign="center">
                                <Typography variant="h2" paragraph>
                                    <Translate msg="users.detail.main.no_roles.title" />
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<Add />}
                                    onClick={() => this.setState({ isAddOpen: true })}
                                >
                                    <Translate msg="users.detail.main.no_roles.button" />
                                </Button>
                            </Box>
                        </Box>
                    </>
                );
            }

            return (
                <>
                    <Box>
                        <Collapse in={hasChangeToCheck}>
                            <Box marginX={2} marginBottom={2}>
                                <Alert severity="warning">
                                    <Translate msg="users.detail.main.alert.save_changes" />
                                </Alert>
                            </Box>
                        </Collapse>
                        <DetailActions
                            onSave={handleSaveAction}
                            onDelete={() => { }}
                            onAdd={() => this.setState({ isAddOpen: true })}
                            isCreateRoute={this.isCreateUserRoute()}
                        />
                    </Box>
                    {
                        !this.isCreateUserRoute() && (
                            <Box marginY={1}>
                                <GenericList
                                    listItems={roleItems}
                                    columns={roleColumns}
                                    listActions={[{
                                        icon: <Delete />,
                                        label: translator('user.detail.main.list.item.actions.delete'),
                                        onClick: (id, index) => this.setState({ roleIndexToDelete: index }),
                                        hideAction: () => (
                                            !checkAuthority(state, SECURITY_PRIVILEGES.S_ROLES_WRITE)
                                            || !checkAuthority(state, SECURITY_PRIVILEGES.S_USERS_WRITE)
                                        ),
                                    }]}
                                />
                            </Box>
                        )
                    }

                </>
            );
        }

        private renderAddRole() {
            const { teams, selectedTeamIndex, newUserDetail } = this.state;

            return (
                <AddRole
                    onClose={() => this.setState({ isAddOpen: false })}
                    onAdd={(role: ITeamRole) => this.setState({ roleToAdd: role })}
                    teamName={teams[selectedTeamIndex].name}
                    userRoles={(newUserDetail as IUser).roles}
                    userId={(newUserDetail as IUser).id}
                />
            );
        }

        private onAddRole() {
            const { roleToAdd, newUserDetail, teams, selectedTeamIndex } = this.state;

            if (roleToAdd) {
                this.updateUser({
                    roles: [...(newUserDetail as IUser).roles, {
                        id: roleToAdd.id,
                        name: roleToAdd.name,
                        team: teams[selectedTeamIndex],
                        privileges: roleToAdd.privileges.map((privilege) => ({
                            uuid: privilege.uuid,
                            privilege: privilege.privilege,
                        })),
                    }],
                });
            }

            this.setState({ isAddOpen: false });
        }

        private onDeleteRole() {
            const {
                newUserDetail,
                teams,
                selectedTeamIndex,
                roleIndexToDelete,
            } = this.state;
            const currentTeam = teams[selectedTeamIndex];
            const newRoles = [...getRolesFromTeam(currentTeam, (newUserDetail as IUser).roles)];

            if (roleIndexToDelete !== null) {
                newRoles.splice(roleIndexToDelete, 1);
                this.updateUser({
                    roles: (newUserDetail as IUser).roles.flatMap((role) => {
                        if (role.team.name === currentTeam.name) {
                            if (newRoles.find((newRole) => newRole.name === role.name)) {
                                return [role];
                            }
                            return [];
                        }
                        return [role];
                    }),
                });
                this.setState({ roleIndexToDelete: null });
            }
        }

        private updateUser(fieldsToUpdate: Partial<IUserPost | IUser>) {
            this.setState((prevState) => ({
                newUserDetail: {
                    ...prevState.newUserDetail,
                    ...fieldsToUpdate,
                },
                hasChangeToCheck: true,
            }));
        }

        private updateUserInStateIfNewUserWasLoaded(prevProps: TProps & IObserveProps) {
            const userDetail = getAsyncUserDetail(this.props.state).data;
            const prevUserDetail = getAsyncUserDetail(prevProps.state).data;

            if (getUniqueIdFromUser(userDetail) !== getUniqueIdFromUser(prevUserDetail) && userDetail) {
                const userDetailDeepClone = clone(userDetail);
                this.setState({
                    newUserDetail: userDetailDeepClone,
                    teams: userDetailDeepClone.teams,
                    selectedTeamIndex: 0,
                });
            }
        }

        private navigateToUserAfterCreation(prevProps: TProps & IObserveProps) {
            const { newUserDetail } = this.state;
            const { status } = getAsyncUserDetail(this.props.state).create;
            const { status: prevStatus } = getAsyncUserDetail(prevProps.state).create;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                redirectTo({
                    routeKey: ROUTE_KEYS.R_USER_DETAIL,
                    params: {
                        name: newUserDetail.username,
                    },
                });
            }
        }

        private navigateToUserAfterUpdate(prevProps: TProps & IObserveProps) {
            const { newUserDetail } = this.state;
            const { status } = getAsyncUserDetail(this.props.state).update;
            const { status: prevStatus } = getAsyncUserDetail(prevProps.state).update;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                redirectTo({
                    routeKey: ROUTE_KEYS.R_USER_DETAIL,
                    params: {
                        name: newUserDetail.username,
                    },
                });
            }
        }

        private reloadPageAfterRoleAssignment(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncUserDetailRole(this.props.state).create;
            const { status: prevStatus } = getAsyncUserDetailRole(prevProps.state).create;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                this.onAddRole();
            }
        }

        private reloadPageAfterRoleDeletion(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncUserDetailRole(this.props.state).remove;
            const { status: prevStatus } = getAsyncUserDetailRole(prevProps.state).remove;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                this.onDeleteRole();
            }
        }

        private navigateToUsersAfterDeletion(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncUserDetail(this.props.state).remove;
            const { status: prevStatus } = getAsyncUserDetail(prevProps.state).remove;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                redirectTo({
                    routeKey: ROUTE_KEYS.R_USERS,
                });
            }
        }

        private isCreateUserRoute() {
            const currentRouteKey = getRouteKeyByPath({ path: this.props.match.path });
            return currentRouteKey === ROUTE_KEYS.R_USER_NEW;
        }
    },
);

function getRolesFromTeam(team: IUserTeam, userRoles: IUserRole[]) {
    return team && userRoles.length
        ? userRoles.flatMap((role) => {
            if (role.team.name === team.name) {
                return [role];
            }
            return [];
        })
        : [];
}

function mapRoleToListItems(team: IUserTeam, userRoles: IUserRole[]) {
    if (!team) {
        return [];
    }
    const roles = getRolesFromTeam(team, userRoles);

    const newListItems: IListItem<Partial<IUserRole>>[] = roles.map((role) => ({
        id: role.id,
        columns: {
            name: role.name,
            privileges: role.privileges.map((privilege) => privilege.privilege).join(','),
        },
        data: {
            name: role.name,
            privileges: role.privileges.map((privilege) => privilege.privilege).join(','),
        },
        canBeDeleted: true,
    }));

    return newListItems;
}

export default observe([
    StateChangeNotification.I18N_TRANSLATIONS,
    StateChangeNotification.IAM_USERS_DETAIL,
    StateChangeNotification.IAM_USER_DETAIL_ROLE,
], withRouter(UserDetail));
