import React from 'react';
import { FormControlLabel, Switch, withStyles } from '@material-ui/core';
import { red, green } from '@material-ui/core/colors';
import { observe, IObserveProps } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { IAccessLevel, SECURITY_PRIVILEGES } from 'models/state/auth.models';
import { getStore } from 'state';
import { getUserPermissions } from 'state/auth/selectors';
import { updateUserPermission } from 'state/auth/actions';

const { dispatch } = getStore();

const CustomSwitch = withStyles({
    switchBase: {
        color: red[300],
        '& + $track': {
            backgroundColor: red[500],
        },
        '&$checked': {
            color: green[500],
        },
        '&$checked + $track': {
            backgroundColor: green[500],
        },
    },
    checked: {},
    track: {},
})(Switch);

function MockPermissions({ state }: IObserveProps) {
    const permissions = [{group: 'PUBLIC',
     privilege: SECURITY_PRIVILEGES.S_CONNECTIONS_WRITE}];
    const userPermissions = getUserPermissions(state);

    return (
        <div>
            {permissions.map((p) => {
                // TODO: figure out update of user rights
                const permission = p as IAccessLevel;
                // const hasPermission = userPermissions[permission];
                const hasPermission = true;

                return (
                    <FormControlLabel
                        key={`switch-${permission}-permission`}
                        control={(
                            <CustomSwitch
                                checked={hasPermission}
                                onClick={() => dispatch(updateUserPermission({ permission }))}
                                color="default"
                            />
                        )}
                        label={`${permission} permission`}
                    />
                );
            })}
        </div>
    );
}

export default observe(
    [StateChangeNotification.AUTH],
    MockPermissions,
);
