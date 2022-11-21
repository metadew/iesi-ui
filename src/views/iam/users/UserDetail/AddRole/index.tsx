import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    ButtonGroup,
    darken,
    FormControl,
    makeStyles,
    Paper,
    TextField,
    Typography,
} from '@material-ui/core';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { THEME_COLORS } from 'config/themes/colors';
import { IObserveProps, observe } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { triggerFetchTeamDetail } from 'state/entities/teams/triggers';
import { getAsyncTeamDetail } from 'state/entities/teams/selectors';
import { Autocomplete } from '@material-ui/lab';
import { ITeam, ITeamRole } from 'models/state/team.model';
import DescriptionList, { IDescriptionListItem } from 'views/common/list/DescriptionList';
import { IUserPrivilege, IUserRole } from 'models/state/user.model';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import Loader from 'views/common/waiting/Loader';
import { triggerAssignUserRole } from 'state/entities/users/triggers';

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
    teamName: string;
    userRoles: IUserRole[];
    userId: string;
}

function AddRole({ onClose, onAdd, teamName, userRoles, userId, state }: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const teamStatus = getAsyncTeamDetail(state).fetch.status;
    const team = getAsyncTeamDetail(state).data;
    const [role, setRole] = useState<ITeamRole>(null);

    useEffect(() => {
        triggerFetchTeamDetail({
            name: teamName,
        });
    }, [teamName]);

    const handleChange = (_: React.ChangeEvent<{}>, value: ITeamRole) => {
        setRole(value);
    };

    const handleSubmit = () => {
        if (role) {
            triggerAssignUserRole({
                id: team.id,
                roleId: role.id,
                userId,
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
                    <Box marginBottom={2} width="100%">
                        <FormControl className={classes.select}>
                            <Autocomplete
                                id="user-roles"
                                options={team && filterExistingRoles(team, userRoles)}
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

function filterExistingRoles(team: ITeam, roles: IUserRole[]) {
    return team.roles.filter((teamRole) => !roles.find((role) => role.id === teamRole.id));
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
], AddRole);
