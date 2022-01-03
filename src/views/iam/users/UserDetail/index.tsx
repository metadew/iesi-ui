import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IObserveProps, observe } from 'views/observe';
import { Box, createStyles, WithStyles, withStyles } from '@material-ui/core';
import { IUser, IUserBase, IUserPost } from 'models/state/user.model';
import { getAsyncUserDetail } from 'state/entities/users/selectors';
import { getUniqueIdFromUser } from 'utils/users/userUtils';
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
import EditTeams from './EditTeams';

const styles = () => createStyles({});

type TProps = WithStyles<typeof styles>;

interface IComponentState {
    newUserDetail: IUserBase | IUserPost;
    selectedTeamIndex: number;
    roleIndexToEdit: number;
    roleIndexToDelete: number;
    hasChangeToCheck: boolean;
    isAddOpen: boolean;
    isSaveDialogOpen: boolean;
    isConfirmDeleteUserOpen: boolean;
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
};

const UserDetail = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps & RouteComponentProps, IComponentState> {
        public constructor(props: TProps & IObserveProps & RouteComponentProps) {
            super(props);

            this.state = {
                newUserDetail: this.isCreateUserRoute() ? initialUserPostDetail : initialUserDetail,
                selectedTeamIndex: -1,
                roleIndexToEdit: null,
                roleIndexToDelete: null,
                hasChangeToCheck: false,
                isAddOpen: false,
                isSaveDialogOpen: false,
                isConfirmDeleteUserOpen: false,
                requiredFieldsState: {
                    username: {
                        showError: false,
                    },
                    password: {
                        showError: false,
                    },
                },
            };

            this.renderUserDetailPanel = this.renderUserDetailPanel.bind(this);

            this.updateUserInStateIfNewUserWasLoaded = this.updateUserInStateIfNewUserWasLoaded.bind(this);
            this.navigateToUserAfterCreation = this.navigateToUserAfterCreation.bind(this);
            this.navigateToUsersAfterDeletion = this.navigateToUsersAfterDeletion.bind(this);
        }

        public componentDidUpdate() {
            // this.updateUserInStateIfNewUserWasLoaded(prevProps);
            // this.navigateToUserAfterCreation(prevProps);
            // this.navigateToUsersAfterDeletion(prevProps);
        }

        public render() {
            return (
                <>
                    <ContentWithSidePanel
                        panel={this.renderUserDetailPanel()}
                        content={null}
                        contentOverlay={null}
                        contentOverlayOpen={false}
                        toggleLabel={<Translate msg="users.detail.side.toggle_button" />}
                        goBackTo={ROUTE_KEYS.R_USERS}
                    />
                </>
            );
        }

        private renderUserDetailPanel() {
            const { state } = this.props;
            const { newUserDetail, requiredFieldsState, selectedTeamIndex } = this.state;
            const translator = getTranslator(state);

            return (
                <Box mt={1} display="flex" flexDirection="column" flex="1 1 auto">
                    <Box flex="1 1 auto">
                        <form noValidate autoComplete="off">
                            <TextInput
                                id="user-name"
                                label={translator('users.detail.side.user_name')}
                                InputProps={{
                                    readOnly: !this.isCreateUserRoute() && newUserDetail !== undefined,
                                    disableUnderline: true,
                                }}
                                value={newUserDetail.username}
                                onChange={(e) => this.updateUser({ username: e.target.value })}
                                required={this.isCreateUserRoute()}
                                error={requiredFieldsState.username.showError}
                                helperText={requiredFieldsState.username.showError && 'Username is a required field'}
                            />
                            {
                                this.isCreateUserRoute() && (
                                    <>
                                        <TextInput
                                            id="user-password"
                                            label={translator('users.detail.side.user_password')}
                                            value={newUserDetail && (newUserDetail as IUserPost).password}
                                            onChange={(e) => this.updateUser({ password: e.target.value })}
                                            error={requiredFieldsState.password.showError}
                                            // eslint-disable-next-line max-len
                                            helperText={requiredFieldsState.password.showError && 'User password is a required field'}
                                        />
                                        <DescriptionList
                                            noLineAfterListItem
                                            items={[].concat({
                                                label: <Translate msg="users.detail.side.teams.title" />,
                                                value: <EditTeams
                                                    teams={newUserDetail && (newUserDetail as IUser).teams}
                                                    selectedIndex={selectedTeamIndex}
                                                    onTeamSelected={() => { }}
                                                    onSubmit={() => { }}
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

        public componentDidUpate(prevProps: TProps & IObserveProps) {
            this.updateUserInStateIfNewUserWasLoaded(prevProps);
        }

        private updateUserInStateIfNewUserWasLoaded(prevProps: TProps & IObserveProps) {
            const userDetail = getAsyncUserDetail(this.props.state).data;
            const prevUserDetail = getAsyncUserDetail(prevProps.state).data;

            if (getUniqueIdFromUser(userDetail) !== getUniqueIdFromUser(prevUserDetail)) {
                const userDetailDeepClone = clone(userDetail);
                this.setState({ newUserDetail: userDetailDeepClone });
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

export default observe([
    StateChangeNotification.I18N_TRANSLATIONS,
    StateChangeNotification.IAM_USERS_DETAIL,
], withRouter(UserDetail));
