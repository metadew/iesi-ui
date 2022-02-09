import React, { useState, useEffect } from 'react';
import {
    makeStyles,
    Typography,
    Box,
    Paper,
    ButtonGroup,
    Button,
    darken,
    FormControl,
    TextField,
} from '@material-ui/core';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { THEME_COLORS } from 'config/themes/colors';
import { IObserveProps, observe } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { ITeamBase, ITeamRole } from 'models/state/team.model';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { Autocomplete } from '@material-ui/lab';
import { IUser, IUserBase } from 'models/state/user.model';
import { getAsyncUsersEntity } from 'state/entities/users/selectors';
import { triggerAssignUserRole, triggerFetchUsers } from 'state/entities/users/triggers';

const useStyles = makeStyles(({ palette, typography }) => ({
    dialog: {
        background: palette.background.default,
        width: '40%',
        margin: 'auto',
    },
    header: {
        background: palette.background.paper,
    },
    index: {
        fontWeight: typography.fontWeightBold,
        textAlign: 'center',
    },
    textField: {
        marginTop: 0,
        '& .MuiFilledInput-root': {
            background: palette.background.paper,
        },
    },
    tableCell: {
        position: 'relative',
        '&:after': {
            content: '" "',
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: '1px',
            backgroundColor: THEME_COLORS.GREY,
        },
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 8,
    },
    select: {
        alignSelf: 'flex-start',
        width: '100%',
        marginTop: 4,
        marginBottom: 4,
    },
    keyInput: {
        marginRight: 4,
    },
    valueInput: {
        marginLeft: 4,
    },
    addButton: {
        backgroundColor: palette.type === 'light'
            ? THEME_COLORS.GREY_LIGHT
            : darken(THEME_COLORS.GREY_DARK, 0.2),
    },
}));

interface IPublicProps {
    onClose: () => void;
    onAdd: (user: IUser, role: ITeamRole) => void;
    team: ITeamBase;
}

function AddUser({ onClose, onAdd, team, state }: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const [userSearchInput, setUserSearchInput] = useState<string>('');
    const [user, setUser] = useState<IUserBase>(undefined);
    const [role, setRole] = useState<ITeamRole>(undefined);
    const usersEntity = getAsyncUsersEntity(state).data;
    const usersLoading = getAsyncUsersEntity(state).fetch.status === AsyncStatus.Busy;

    useEffect(() => {
        triggerFetchUsers({
            pagination: {
                page: 1,
                size: 10,
            },
            filter: {
                username: userSearchInput.length > 0 && userSearchInput,
            },
            sort: 'username,asc',
        });
    }, [userSearchInput]);

    const handleChangeUser = (_: React.ChangeEvent<{}>, value: IUserBase) => {
        setUser(value);
    };

    const handleChangeRole = (_: React.ChangeEvent<{}>, value: ITeamRole) => {
        setRole(value);
    };

    const handleSubmit = () => {
        if (user && role) {
            triggerAssignUserRole({
                id: team.id,
                roleId: role.id,
                userId: user.id,
            });
            onAdd(user, role);
            setUser(null);
        }
    };

    const handleClose = () => onClose();

    return (
        <Box className={classes.dialog}>
            <Box
                className={classes.header}
                display="flex"
                justifyContent="center"
                alignItems="center"
                padding={2}
            >
                <Typography variant="h2">
                    <Translate msg="teams.detail.main.add_users.header" />
                </Typography>
            </Box>
            <Box padding={2}>
                <Paper className={classes.paper}>
                    <Box marginBottom={2} width="100%">
                        <FormControl className={classes.select}>
                            <Autocomplete
                                options={usersEntity && usersEntity.users}
                                getOptionLabel={(option: IUser) => option.username}
                                loading={usersLoading}
                                onInputChange={(_, newValue) => setUserSearchInput(newValue)}
                                onChange={handleChangeUser}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="user-name"
                                        variant="outlined"
                                    />
                                )}
                                freeSolo
                            />
                        </FormControl>
                    </Box>
                    <Box marginBottom={2} width="100%">
                        <FormControl className={classes.select}>
                            <Autocomplete
                                options={user && filterExistingRoles(user, team.roles)}
                                getOptionLabel={(option: ITeamRole) => option.name}
                                onChange={handleChangeRole}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="role-name"
                                        variant="outlined"
                                    />
                                )}
                                disabled={!user}
                            />
                        </FormControl>
                    </Box>
                </Paper>
                <Box marginTop={3} textAlign="right">
                    <ButtonGroup size="small">
                        <Button
                            variant="outlined"
                            color="default"
                            onClick={handleClose}
                            disableElevation
                        >
                            <Translate msg="teams.detail.main.add_roles.footer.cancel" />
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleSubmit}
                            disableElevation
                        >
                            <Translate msg="teams.detail.main.add_roles.footer.save" />
                        </Button>
                    </ButtonGroup>
                </Box>
            </Box>
        </Box>
    );
}

function filterExistingRoles(user: IUser, roles: ITeamRole[]) {
    return roles.filter((role) => role.id !== user.roles
        .find((userRole) => userRole.id === role.id)?.id);
}

export default observe<IPublicProps>([
    StateChangeNotification.IAM_USERS_LIST,
], AddUser);
