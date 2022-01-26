import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IObserveProps, observe } from 'views/observe';
import {
    createStyles,
    WithStyles,
    withStyles,
} from '@material-ui/core';
import { ITeam, ITeamBase, ITeamPost } from 'models/state/team.model';
import { getRouteKeyByPath, ROUTE_KEYS } from 'views/routes';
import { StateChangeNotification } from 'models/state.models';

const styles = () => createStyles({});

type TProps = WithStyles<typeof styles>;

interface IComponentState {
    newTeamDetail: ITeamBase | ITeamPost;
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
            };
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            
        }

        public render() {
            return <p>Coucou</p>;
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
