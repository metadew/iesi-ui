import React from 'react';
import { FormControlLabel, Switch, withStyles } from '@material-ui/core';
import { observe, IObserveProps } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { getUserPermissions } from 'state/auth/selectors';
import { getStore } from 'state';
import { updateUserPermission } from 'state/auth/actions';
import { IAccessLevel } from 'models/router.models';
import { red, green } from '@material-ui/core/colors';

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
    const permissions = ['execute', 'edit'];
    const userPermissions = getUserPermissions(state);

    return (
        <div>
            {permissions.map((p) => {
                const permission = p as keyof IAccessLevel;
                const hasPermission = userPermissions[permission];

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
