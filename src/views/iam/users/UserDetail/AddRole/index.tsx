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
import { triggerFetchTeamDetail } from 'state/entities/teams/triggers';
import { getAsyncTeamDetail } from 'state/entities/teams/selectors';
import { Autocomplete } from '@material-ui/lab';
import { ITeam, ITeamBase, ITeamRole } from 'models/state/team.model';
import DescriptionList, { IDescriptionListItem } from 'views/common/list/DescriptionList';
import { IUser, IUserEntity, IUserPrivilege, IUserTeam } from 'models/state/user.model';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import Loader from 'views/common/waiting/Loader';
import { triggerAssignUserRole, triggerFetchUsers } from 'state/entities/users/triggers';
import { getAsyncUsersEntity } from 'state/entities/users/selectors';

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
    onAdd: (role: ITeamRole) => void;
    team: ITeamBase | IUserTeam;
    user?: IUser | IUserEntity;
}

function AddRole({ onClose, onAdd, team, user, state }: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const teamStatus = getAsyncTeamDetail(state).fetch.status;
    const [role, setRole] = useState<ITeamRole>(null);
    const [userSearchInput, setUserSearchInput] = useState<string>('');
    const [currentUser, setCurrentUser] = useState<IUser>(isTeamBase(team) ? undefined : (user as IUser));
    const userEntity = isTeamBase(team) ? getAsyncUsersEntity(state).data : user;
    const teamEntity = isTeamBase(team) ? team : getAsyncTeamDetail(state).data;
    const userLoading = getAsyncUsersEntity(state).fetch.status === AsyncStatus.Busy;

    useEffect(() => {
        if (!isTeamBase(team)) {
            triggerFetchTeamDetail({
                name: team.name,
            });
        } else {
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
        }
    }, [team, userSearchInput]);

    const handleChange = (_: React.ChangeEvent<{}>, value: ITeamRole) => {
        setRole(value);
    };

    const handleSubmit = () => {
        if (role) {
            triggerAssignUserRole({
                id: teamEntity.id,
                roleId: role.id,
                userId: currentUser.id,
            });
            onAdd(role);
            setRole(null);
        }
    };

    const handleClose = () => onClose();

    return (
        <Box className={classes.dialog}>
            <Loader show={teamStatus === AsyncStatus.Busy} />
            <Box
                className={classes.header}
                display="flex"
                justifyContent="center"
                alignItems="center"
                padding={2}
            >
                <Typography variant="h2">
                    <Translate msg="users.detail.main.add_roles.header" />
                </Typography>
            </Box>
            <Box padding={2}>
                <Paper className={classes.paper}>
                    {
                        isTeamBase(team) && (userEntity as IUserEntity) && (
                            <Box marginBottom={2} width="100%">
                                <FormControl className={classes.select}>
                                    <Autocomplete
                                        options={userEntity
                                            && filterExistingUsers(
                                                teamEntity,
                                                (userEntity as IUserEntity).users,
                                            )}
                                        getOptionLabel={(option: IUser) => option.username}
                                        loading={userLoading}
                                        onInputChange={(_, newValue) => setUserSearchInput(newValue)}
                                        onChange={(_: React.ChangeEvent<{}>, value: IUser) => setCurrentUser(value)}
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
                        )
                    }
                    <Box marginBottom={2} width="100%">
                        <FormControl className={classes.select}>
                            <Autocomplete
                                id="user-roles"
                                options={teamEntity
                                    && filterExistingRoles(
                                        teamEntity,
                                        isTeamBase(team) ? currentUser : (userEntity as IUser),
                                    )}
                                getOptionLabel={(option: ITeamRole) => option.name}
                                onChange={handleChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Roles"
                                        variant="outlined"
                                    />
                                )}

                            />
                        </FormControl>
                    </Box>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        marginBottom={2}
                        width="100%"
                    >
                        {
                            role && (
                                <DescriptionList
                                    items={mapPrivilegeToListItems(role.privileges)}
                                    noLineAfterListItem
                                />
                            )
                        }
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
                            <Translate msg="users.detail.main.add_roles.footer.cancel" />
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleSubmit}
                            disableElevation
                        >
                            <Translate msg="users.detail.main.add_roles.footer.save" />
                        </Button>
                    </ButtonGroup>
                </Box>
            </Box>
        </Box>
    );
}

function isTeamBase(team: ITeamBase | IUserTeam): team is ITeamBase {
    return 'teamName' in team;
}

function filterExistingUsers(team: ITeam, users: IUser[]): IUser[] {
    return users.filter((user) => user.id !== team.users
        .find((teamUser) => teamUser.id === user.id)?.id);
}

function filterExistingRoles(team: ITeam, user: IUser) {
    return team.roles.filter((teamRole) => user && !user.roles.find((role) => role.id === teamRole.id));
}

function mapPrivilegeToListItems(privileges: IUserPrivilege[]) {
    const listItems: IDescriptionListItem[] = privileges.map((privilege) => ({
        label: privilege.privilege,
        value: '',
    }));

    return listItems;
}

export default observe<IPublicProps>([
    StateChangeNotification.IAM_TEAMS_DETAIL,
    StateChangeNotification.IAM_USERS_LIST,
], AddRole);
