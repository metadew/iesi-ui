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
    ISecurityGroup,
    ISecurityGroupBase,
    ISecurityGroupPost,
    ISecurityGroupTeam,
    ISecurityGroupTeamColumnNames,
} from 'models/state/securityGroups.model';
import { ITeam } from 'models/state/team.model';
import { getRouteKeyByPath, redirectTo, ROUTE_KEYS } from 'views/routes';
import { StateChangeNotification } from 'models/state.models';
import { getAsyncSecurityGroupDetail } from 'state/entities/securityGroups/selectors';
import { getAsyncTeamDetailSecurityGroup } from 'state/entities/teams/selectors';
import { clone } from 'lodash';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import { checkAuthorityGeneral } from 'state/auth/selectors';
import Loader from 'views/common/waiting/Loader';
import requiredFieldsCheck from 'utils/form/requiredFieldsCheck';
import { TRequiredFieldsState } from 'models/form.models';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import {
    triggerCreateSecurityGroupDetail,
    triggerDeleteSecurityGroupDetail,
} from 'state/entities/securityGroups/triggers';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getTranslator } from 'state/i18n/selectors';
import TextInput from 'views/common/input/TextInput';
import GenericList from 'views/common/list/GenericList';
import { IListItem, ListColumns } from 'models/list.models';
import { getUniqueIdFromSecurityGroup } from 'utils/securityGroups/securityGroupUtils';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
import DetailActions from '../DetailActions';
import AddTeam from '../AddTeam';

const styles = () => createStyles({});

type TProps = WithStyles<typeof styles>;

interface IComponentState {
    newSecurityGroupDetail: ISecurityGroupBase | ISecurityGroupPost;
    teamToAdd: ITeam;
    hasChangeToCheck: boolean;
    isSaveDialogOpen: boolean;
    isAddOpen: boolean;
    isConfirmDeleteSecurityGroupOpen: boolean;
    requiredFieldsState: TRequiredFieldsState<ISecurityGroupPost>;
}

const initialSecurityGroupDetail: ISecurityGroup = {
    name: '',
    teams: [],
    securedObjects: [],
};

const initialSecurityGroupPostDetail: ISecurityGroupPost = {
    name: '',
};

const SecurityGroupDetail = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps & RouteComponentProps, IComponentState> {
        public constructor(props: TProps & IObserveProps & RouteComponentProps) {
            super(props);

            this.state = {
                newSecurityGroupDetail: this.isCreateRoute()
                    ? initialSecurityGroupPostDetail
                    : initialSecurityGroupDetail,
                teamToAdd: undefined,
                hasChangeToCheck: false,
                isSaveDialogOpen: false,
                isAddOpen: false,
                isConfirmDeleteSecurityGroupOpen: false,
                requiredFieldsState: {
                    name: {
                        showError: false,
                    },
                },
            };

            // eslint-disable-next-line max-len
            this.updateSecurityGroupIsNewSecurityGroupWasLoaded = this.updateSecurityGroupIsNewSecurityGroupWasLoaded.bind(this);
            this.navigateToSecurityGroupAfterCreation = this.navigateToSecurityGroupAfterCreation.bind(this);
            this.navigateToSecurityGroupsAfterDeletion = this.navigateToSecurityGroupsAfterDeletion.bind(this);
            this.reloadPageAfterTeamAssignment = this.reloadPageAfterTeamAssignment.bind(this);

            this.renderSecurityGroupDetailPanel = this.renderSecurityGroupDetailPanel.bind(this);
            this.renderSecurityGroupDetailContent = this.renderSecurityGroupDetailContent.bind(this);

            this.renderAddTeam = this.renderAddTeam.bind(this);

            this.onDeleteSecurityGroup = this.onDeleteSecurityGroup.bind(this);
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            this.updateSecurityGroupIsNewSecurityGroupWasLoaded(prevProps);
            this.navigateToSecurityGroupAfterCreation(prevProps);
            this.navigateToSecurityGroupsAfterDeletion(prevProps);
            this.reloadPageAfterTeamAssignment(prevProps);
        }

        public render() {
            const { state } = this.props;
            const {
                newSecurityGroupDetail,
                isAddOpen,
                isSaveDialogOpen,
                isConfirmDeleteSecurityGroupOpen,
            } = this.state;
            const securityGroupDetailAsyncStatus = getAsyncSecurityGroupDetail(state).fetch.status;
            const securityGroupDetailAsyncDeleteStatus = getAsyncSecurityGroupDetail(state).remove.status;
            const teamAssigningAsyncStatus = getAsyncTeamDetailSecurityGroup(state).create.status;
            const translator = getTranslator(state);

            return (
                <>
                    <Loader
                        show={
                            securityGroupDetailAsyncStatus === AsyncStatus.Busy
                            || teamAssigningAsyncStatus === AsyncStatus.Busy
                        }
                    />
                    <ContentWithSidePanel
                        panel={this.renderSecurityGroupDetailPanel()}
                        content={this.renderSecurityGroupDetailContent()}
                        contentOverlay={this.renderAddTeam()}
                        contentOverlayOpen={isAddOpen}
                        toggleLabel={
                            <Translate msg="security_groups.detail.side.toggle_button" />
                        }
                        goBackTo={ROUTE_KEYS.R_SECURITY_GROUPS}
                    />
                    <ConfirmationDialog
                        title={translator('security_groups.detail.delete_security_group_dialog.title')}
                        text={translator('security_groups.detail.delete_security_group_dialog.text')}
                        open={isConfirmDeleteSecurityGroupOpen}
                        onClose={() => this.setState({ isConfirmDeleteSecurityGroupOpen: false })}
                        onConfirm={this.onDeleteSecurityGroup}
                        showLoader={securityGroupDetailAsyncDeleteStatus === AsyncStatus.Busy}
                    />
                    <ClosableDialog
                        title={translator('security_groups.detail.save_security_group_dialog.title')}
                        open={isSaveDialogOpen}
                        onClose={() => this.setState({ isSaveDialogOpen: false })}
                    >
                        <Typography>
                            <Translate
                                msg="security_groups.detail.save_security_group_dialog.text"
                                placeholders={{
                                    name: newSecurityGroupDetail.name,
                                }}
                            />
                        </Typography>
                        <Box display="flex" alignItems="center" justifyContent="center" marginTop={2}>
                            <Box paddingRight={1}>
                                <Button
                                    id="save-security-group"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() =>
                                        triggerCreateSecurityGroupDetail(newSecurityGroupDetail as ISecurityGroupPost)}
                                >
                                    <Translate msg="security_groups.detail.save_security_group_dialog.create" />
                                </Button>
                            </Box>
                        </Box>
                    </ClosableDialog>
                </>
            );
        }

        private renderSecurityGroupDetailPanel() {
            const { state } = this.props;
            const {
                newSecurityGroupDetail,
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
                                id="security-group-name"
                                label={translator('security_groups.detail.side.name')}
                                InputProps={{
                                    readOnly: !this.isCreateRoute() && newSecurityGroupDetail !== undefined,
                                    disableUnderline: true,
                                }}
                                value={newSecurityGroupDetail.name}
                                onChange={(e) => this.updateSecurityGroup({
                                    name: e.target.value,
                                })}
                                error={requiredFieldsState.name.showError}
                                helperText={requiredFieldsState.name.showError
                                    && 'The security group name is a required field'}
                            />
                        </form>
                    </Box>
                </Box>
            );
        }

        private renderSecurityGroupDetailContent() {
            const { state } = this.props;
            const { newSecurityGroupDetail, hasChangeToCheck } = this.state;
            const translator = getTranslator(state);
            const teamItems = mapTeamToListItems((newSecurityGroupDetail as ISecurityGroupBase).teams);
            const hasTeams = teamItems.length > 0;

            const handleSaveAction = () => {
                if (this.isCreateRoute()) {
                    const { passed: passedRequired, requiredFieldsState } = requiredFieldsCheck<ISecurityGroupPost>({
                        data: newSecurityGroupDetail as ISecurityGroupPost,
                        requiredFields: ['name'],
                    });

                    if (passedRequired) {
                        this.setState({
                            isSaveDialogOpen: true,
                            requiredFieldsState,
                            hasChangeToCheck: true,
                        });
                    } else {
                        this.setState({
                            requiredFieldsState,
                        });
                    }
                }
            };

            const teamColums: ListColumns<Partial<ISecurityGroupTeamColumnNames>> = {
                teamName: {
                    label: (
                        <Translate msg="security_groups.detail.main.list.item.labels.team_name" />
                    ),
                    fixedWidth: '100%',
                },
            };

            if (!hasTeams && !this.isCreateRoute()) {
                return (
                    <>
                        <DetailActions
                            onSave={handleSaveAction}
                            onDelete={() => this.setState({ isConfirmDeleteSecurityGroupOpen: true })}
                            onAdd={null}
                            isCreateRoute={this.isCreateRoute()}
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
                                    <Translate msg="security_groups.detail.main.no_teams.title" />
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<Add />}
                                    onClick={() => this.setState({ isAddOpen: true })}
                                >
                                    <Translate msg="security_groups.detail.main.no_teams.button" />
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
                                    <Translate msg="security_groups.detail.main.alert.save_changes" />
                                </Alert>
                            </Box>
                        </Collapse>
                        <DetailActions
                            onSave={handleSaveAction}
                            onDelete={() => this.setState({ isConfirmDeleteSecurityGroupOpen: true })}
                            onAdd={() => this.setState({ isAddOpen: true })}
                            isCreateRoute={this.isCreateRoute()}
                        />
                    </Box>
                    {
                        !this.isCreateRoute() && (
                            <Box marginY={1}>
                                <GenericList
                                    listItems={teamItems}
                                    columns={teamColums}
                                    listActions={[{
                                        icon: <Edit />,
                                        label: translator('security_groups.detail.main.list.item.actions.edit'),
                                        onClick: (id, index) => redirectTo({
                                            routeKey: ROUTE_KEYS.R_TEAM_DETAIL,
                                            params: {
                                                name: (newSecurityGroupDetail as ISecurityGroupBase)
                                                    .teams[index].teamName,
                                            },
                                        }),
                                        hideAction: () =>
                                            !checkAuthorityGeneral(
                                                state,
                                                SECURITY_PRIVILEGES.S_TEAMS_WRITE,
                                            ),
                                    }, {
                                        icon: <Visibility />,
                                        label: translator('security_groups.detail.main.list.item.actions.view'),
                                        onClick: (id, index) => redirectTo({
                                            routeKey: ROUTE_KEYS.R_TEAM_DETAIL,
                                            params: {
                                                name: (newSecurityGroupDetail as ISecurityGroupBase)
                                                    .teams[index].teamName,
                                            },
                                        }),
                                        hideAction: () =>
                                            checkAuthorityGeneral(
                                                state,
                                                SECURITY_PRIVILEGES.S_TEAMS_WRITE,
                                            ) || !checkAuthorityGeneral(
                                                state,
                                                SECURITY_PRIVILEGES.S_TEAMS_READ,
                                            ),
                                    }]}
                                />
                            </Box>
                        )
                    }
                </>
            );
        }

        private renderAddTeam() {
            const {
                newSecurityGroupDetail,
            } = this.state;

            return (
                <AddTeam
                    onClose={() => this.setState({ isAddOpen: false })}
                    onAdd={(team) => this.setState({ teamToAdd: team, isAddOpen: false })}
                    securityGroup={(newSecurityGroupDetail as ISecurityGroupBase)}
                />
            );
        }

        private onAddTeam() {
            const { teamToAdd, newSecurityGroupDetail } = this.state;

            if (teamToAdd) {
                this.updateSecurityGroup({
                    teams: [
                        ...(newSecurityGroupDetail as ISecurityGroupBase).teams, {
                            id: teamToAdd.id,
                            teamName: teamToAdd.teamName,
                        },
                    ],
                });
            }
        }

        private onDeleteSecurityGroup() {
            const { state } = this.props;
            const detail = getAsyncSecurityGroupDetail(state).data;
            if (detail) {
                triggerDeleteSecurityGroupDetail({ id: detail.id });
            }
        }

        private updateSecurityGroup(fieldsToUpdate: Partial<ISecurityGroupPost | ISecurityGroup>) {
            this.setState((prevState) => ({
                newSecurityGroupDetail: {
                    ...prevState.newSecurityGroupDetail,
                    ...fieldsToUpdate,
                },
            }));
        }

        private reloadPageAfterTeamAssignment(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncTeamDetailSecurityGroup(this.props.state).create;
            const { status: prevStatus } = getAsyncTeamDetailSecurityGroup(prevProps.state).create;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                this.onAddTeam();
            }
        }

        private navigateToSecurityGroupsAfterDeletion(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncSecurityGroupDetail(this.props.state).remove;
            const { status: prevStatus } = getAsyncSecurityGroupDetail(prevProps.state).remove;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                redirectTo({
                    routeKey: ROUTE_KEYS.R_SECURITY_GROUPS,
                });
            }
        }

        private navigateToSecurityGroupAfterCreation(prevProps: TProps & IObserveProps) {
            const { newSecurityGroupDetail } = this.state;
            const { status } = getAsyncSecurityGroupDetail(this.props.state).create;
            const { status: prevStatus } = getAsyncSecurityGroupDetail(prevProps.state).create;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                redirectTo({
                    routeKey: ROUTE_KEYS.R_SECURITY_GROUP_DETAIL,
                    params: {
                        name: newSecurityGroupDetail.name,
                    },
                });
            }
        }

        private updateSecurityGroupIsNewSecurityGroupWasLoaded(prevProps: TProps & IObserveProps) {
            const securityGroupDetail = getAsyncSecurityGroupDetail(this.props.state).data;
            const prevSecurityGroupDetail = getAsyncSecurityGroupDetail(prevProps.state).data;

            if (
                getUniqueIdFromSecurityGroup(securityGroupDetail)
                !== getUniqueIdFromSecurityGroup(prevSecurityGroupDetail)
                && securityGroupDetail
            ) {
                const securityGroupDetailDeepClone = clone(securityGroupDetail);
                this.setState({
                    newSecurityGroupDetail: securityGroupDetailDeepClone,
                });
            }
        }

        private isCreateRoute() {
            const currentRouteKey = getRouteKeyByPath({
                path: this.props.match.path,
            });

            return currentRouteKey === ROUTE_KEYS.R_SECURITY_GROUP_NEW;
        }
    },
);

function mapTeamToListItems(teams: ISecurityGroupTeam[]) {
    const newListItems: IListItem<Partial<ISecurityGroupTeamColumnNames>>[] = teams ? (
        teams.map((team) => ({
            id: team.id,
            columns: {
                teamName: team.teamName,
            },
        }))
    ) : [];
    return newListItems;
}

export default observe([
    StateChangeNotification.IAM_SECURITY_GROUPS_DETAIL,
    StateChangeNotification.IAM_TEAM_DETAIL_SECURITY_GROUP,
], withRouter(SecurityGroupDetail));
