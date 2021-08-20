// TODO: move to hasrequired
export function checkAuthority(privilege: SECURITY_PRIVILEGES, securityGroupName: string) {
    if (securityGroupName == null || privilege == null) {
        return false;
    }
    return JSON.parse(sessionStorage.getItem('authorities')).includes(`${privilege}@${securityGroupName}`);
}

export function checkAuthorityGeneral(privilege: SECURITY_PRIVILEGES) {
    return JSON.parse(sessionStorage.getItem('authorities'))
        .map((value: string) => value.substr(0, value.indexOf('@'))).includes(privilege);
}
