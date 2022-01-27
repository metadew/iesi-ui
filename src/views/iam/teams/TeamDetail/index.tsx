import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IObserveProps, observe } from 'views/observe';
import {
    Box,
    createStyles,
    WithStyles,
    withStyles,
} from '@material-ui/core';
import { ITeam, ITeamBase, ITeamPost, ITeamRoleUser } from 'models/state/team.model';
import { getRouteKeyByPath, redirectTo, ROUTE_KEYS } from 'views/routes';
import { StateChangeNotification } from 'models/state.models';
import { getAsyncTeamDetail } from 'state/entities/teams/selectors';
import { getUniqueIdFromTeam } from 'utils/teams/teamUtils';
import { clone } from 'lodash';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import Loader from 'views/common/waiting/Loader';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getTranslator } from 'state/i18n/selectors';
import TextInput from 'views/common/input/TextInput';

const styles = () => createStyles({});

type TProps = WithStyles<typeof styles>;

interface IComponentState {
    newTeamDetail: ITeamBase | ITeamPost;
    users: ITeamRoleUser[];
    hasChangeToCheck: boolean;
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
        public constructor(props: TProps & IObserveProps & RouteComponentProps) {
            super(props);

            this.state = {
                newTeamDetail: this.isCreateRoute() ? initialTeamPostDetail : initialTeamDetail,
                users: [],
                hasChangeToCheck: false,
            };

            this.updateTeamInStateIfNewTeamWasLoaded = this.updateTeamInStateIfNewTeamWasLoaded.bind(this);
            this.navigateToTeamAfterCreation = this.navigateToTeamAfterCreation.bind(this);

            this.renderTeamDetailPanel = this.renderTeamDetailPanel.bind(this);
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            this.updateTeamInStateIfNewTeamWasLoaded(prevProps);
            this.navigateToTeamAfterCreation(prevProps);
        }

        public render() {
            const { state } = this.props;
            const teamDetailAsyncStatus = getAsyncTeamDetail(state).fetch.status;

            return (
                <>
                    <Loader
                        show={
                            teamDetailAsyncStatus === AsyncStatus.Busy
                        }
                    />
                    <ContentWithSidePanel
                        panel={this.renderTeamDetailPanel()}
                        content={null}
                        contentOverlay={null}
                        contentOverlayOpen={false}
                        toggleLabel={<Translate msg="teams.detail.side.toggle_button" />}
                        goBackTo={ROUTE_KEYS.R_TEAMS}
                    />
                </>
            );
        }

        private renderTeamDetailPanel() {
            const { state } = this.props;
            const {
                newTeamDetail,
            } = this.state;
            const translator = getTranslator(state);

            return (
                <Box mt={1} display="flex" flexDirection="column" flex="1 1 auto">
                    <Box flex="1 1 auto">
                        <form noValidate autoComplete="off">
                            <TextInput
                                id="team-name"
                                label={translator('teams.detail.side.team_name')}
                                InputProps={{
                                    readOnly: !this.isCreateRoute() && newTeamDetail !== undefined,
                                    disableUnderline: true,
                                }}
                                value={newTeamDetail.teamName}
                                onChange={(e) => this.updateTeam({ teamName: e.target.value })}
                            />
                        </form>
                    </Box>
                </Box>
            );
        }

        private updateTeam(fieldsToUpdate: Partial<ITeamPost | ITeam>) {
            this.setState((prevState) => ({
                newTeamDetail: {
                    ...prevState.newTeamDetail,
                    ...fieldsToUpdate,
                },
            }));
        }

        private navigateToTeamAfterCreation(prevProps: TProps & IObserveProps) {
            const { newTeamDetail } = this.state;
            const { status } = getAsyncTeamDetail(this.props.state).create;
            const { status: prevStatus } = getAsyncTeamDetail(prevProps.state).create;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                redirectTo({
                    routeKey: ROUTE_KEYS.R_TEAM_DETAIL,
                    params: {
                        name: newTeamDetail.teamName,
                    },
                });
            }
        }

        private updateTeamInStateIfNewTeamWasLoaded(prevProps: TProps & IObserveProps) {
            const teamDetail = getAsyncTeamDetail(this.props.state).data;
            const prevTeamDetail = getAsyncTeamDetail(prevProps.state).data;

            if (getUniqueIdFromTeam(teamDetail) !== getUniqueIdFromTeam(prevTeamDetail) && teamDetail) {
                const teamDetailDeepClone = clone(teamDetail);
                this.setState({ newTeamDetail: teamDetailDeepClone, users: teamDetailDeepClone.users });
            }
        }

        private isCreateRoute() {
            const currentRouteKey = getRouteKeyByPath({ path: this.props.match.path });
            return currentRouteKey === ROUTE_KEYS.R_TEAM_NEW;
        }
    },
);

export default observe([
    StateChangeNotification.I18N_TRANSLATIONS,
    StateChangeNotification.IAM_TEAMS_DETAIL,
], withRouter(TeamDetail));
