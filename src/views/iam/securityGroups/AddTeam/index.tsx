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
import { ITeam, ITeamBase, ITeamEntity } from 'models/state/team.model';
import { ISecurityGroupBase, ISecurityGroupTeam } from 'models/state/securityGroups.model';
import { getAsyncTeamsEntity } from 'state/entities/teams/selectors';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { triggerAssignTeamToSecurityGroup, triggerFetchTeams } from 'state/entities/teams/triggers';
import { Autocomplete } from '@material-ui/lab';

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
    onAdd: (team: ITeam) => void;
    securityGroup: ISecurityGroupBase;
}

function AddTeam({ onClose, onAdd, securityGroup, state }: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const [teamSearchInput, setTeamSearchInput] = useState<string>('');
    const [team, setTeam] = useState<ITeamBase>(undefined);
    const teamsEntity = getAsyncTeamsEntity(state).data;
    const teamsLoading = getAsyncTeamsEntity(state).fetch.status === AsyncStatus.Busy;

    useEffect(() => {
        triggerFetchTeams({
            pagination: {
                page: 1,
                size: 10,
            },
            filter: {
                name: teamSearchInput.length > 0 && teamSearchInput,
            },
            sort: 'name,asc',
        });
    }, [securityGroup, teamSearchInput]);

    const handleChange = (_: React.ChangeEvent<{}>, value: ITeamBase) => {
        setTeam(value);
    };

    const handleSubmit = () => {
        if (team) {
            triggerAssignTeamToSecurityGroup({
                id: securityGroup.id,
                teamId: team.id,
            });
            onAdd(team);
            setTeam(null);
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
                    <Translate msg="security_groups.detail.main.add_teams.header" />
                </Typography>
            </Box>
            <Box padding={2}>
                <Paper className={classes.paper}>
                    <Box marginBottom={2} width="100%">
                        <FormControl className={classes.select}>
                            <Autocomplete
                                options={teamsEntity && filterExistingTeams(teamsEntity, securityGroup.teams)}
                                getOptionLabel={(option: ITeam) => option.teamName}
                                loading={teamsLoading}
                                onInputChange={(_, newValue) => setTeamSearchInput(newValue)}
                                onChange={handleChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="team-name"
                                        variant="outlined"
                                    />
                                )}
                                freeSolo
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
                            <Translate msg="security_groups.detail.main.add_teams.footer.cancel" />
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleSubmit}
                            disableElevation
                        >
                            <Translate msg="security_groups.detail.main.add_teams.footer.save" />
                        </Button>
                    </ButtonGroup>
                </Box>
            </Box>
        </Box>
    );
}

function filterExistingTeams(teamEntity: ITeamEntity, securityGroupTeams: ISecurityGroupTeam[]) {
    return teamEntity.teams.filter((team) => team.id !== securityGroupTeams
        .find((securityGroupTeam) => securityGroupTeam.id === team.id)?.id);
}

export default observe<IPublicProps>([
    StateChangeNotification.IAM_SECURITY_GROUPS_DETAIL,
    StateChangeNotification.IAM_TEAMS_LIST,
], AddTeam);
