import { ISecurityGroup } from 'models/state/securityGroups.model';

export function getUniqueIdFromSecurityGroup(securityGroup: ISecurityGroup) {
    return securityGroup ? securityGroup.id : null;
}
