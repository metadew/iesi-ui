import React from 'react';
import { FormControlLabel, Switch, withStyles } from '@material-ui/core';
import { red, green } from '@material-ui/core/colors';
import { observe } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { IAccessLevel } from 'models/state/auth.models';

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

function MockPermissions() {
    const permissions = ['execute', 'edit'];

    return (
        <div>
            {permissions.map((p) => {
                const permission = p as keyof IAccessLevel;
                // const hasPermission = userPermissions[permission];

                return (
                    <FormControlLabel
                        key={`switch-${permission}-permission`}
                        control={(
                            <CustomSwitch
                                // checked={hasPermission}
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
