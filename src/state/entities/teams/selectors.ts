import { IState } from 'models/state.models';
import { ITeam } from 'models/state/team.model';

export const getAsyncTeamsEntity = (state: IState) => state.entities.teams;

export const getAsyncTeams = (state: IState) => {
    const teamsEntity = getAsyncTeamsEntity(state);
    return teamsEntity && teamsEntity.data && teamsEntity.data.teams
        ? teamsEntity.data.teams : [] as ITeam[];
};

export const getAsyncTeamsPageData = (state: IState) => {
    const teamsEntity = getAsyncTeamsEntity(state);
    return teamsEntity && teamsEntity.data ? teamsEntity.data.page : null;
};

export const getAsyncTeamDetail = (state: IState) => state.entities.teamDetail;

export const getAsyncTeamDetailSecurityGroup = (state: IState) => state.entities.teamDetailSecurityGroup;
