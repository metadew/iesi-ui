import { IState } from 'models/state.models';
import { ISecurityGroup } from 'models/state/securityGroups.model';

export const getAsyncSecurityGroupsEntity = (state: IState) =>
    state.entities.securityGroups;

export const getAsyncSecurityGroups = (state: IState) => {
    const securityGroupsEntity = getAsyncSecurityGroupsEntity(state);
    return securityGroupsEntity
        && securityGroupsEntity.data
        && securityGroupsEntity.data.securityGroups
        ? securityGroupsEntity.data.securityGroups
        : ([] as ISecurityGroup[]);
};

export const getAsyncSecurityGroupsPageData = (state: IState) => {
    const securityGroupsEntity = getAsyncSecurityGroupsEntity(state);
    return securityGroupsEntity && securityGroupsEntity.data
        ? securityGroupsEntity.data.page
        : null;
};

export const getAsyncSecurityGroupDetail = (state: IState) =>
    state.entities.securityGroupDetail;
