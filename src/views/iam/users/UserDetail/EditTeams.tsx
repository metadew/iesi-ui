import React, { useState, useMemo, useRef, useEffect } from 'react';
import { observe, IObserveProps } from 'views/observe';
import { ITeam } from 'models/state/team.model';
import { Box, Button, ButtonGroup, FormControl, makeStyles, TextField, Theme, Typography } from '@material-ui/core';
import { StateChangeNotification } from 'models/state.models';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import { getTranslator } from 'state/i18n/selectors';
import { checkAuthorityGeneral } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getAsyncTeams, getAsyncTeamsEntity } from 'state/entities/teams/selectors';
import { triggerFetchTeams } from 'state/entities/teams/triggers';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { Autocomplete } from '@material-ui/lab';
import OrderedList from 'views/common/list/OrderedList';
import { IUserTeam } from 'models/state/user.model';

const useStyles = makeStyles(({ palette }: Theme) => ({
    textField: {
        marginTop: 0,
        '& .MuiFilledInput-root': {
            background: palette.background.paper,
        },
    },
    paperInput: {
        marginTop: 4,
        marginBottom: 4,
    },
    descriptionTextField: {
        whiteSpace: 'pre-line',
    },
    select: {
        alignSelf: 'flex-start',
        width: '100%',
        marginTop: 4,
        marginBottom: 4,
    },
    footer: {
        width: '100%',
        marginTop: 8,
        marginbottom: 4,
    },
}));

interface IPublicProps {
    userTeams: IUserTeam[];
    selectedIndex: number;
    isCreateUserRoute: boolean;
    onTeamSelected: (index: number) => void;
    onSubmit: (team: ITeam) => void;
    onDelete: (index: number) => void;
}

function EditTeamsDialog({
    state,
    onSubmit,
    userTeams,
    selectedIndex,
    onTeamSelected,
}: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [team, setTeam] = useState<ITeam>(undefined);
    const translator = getTranslator(state);
    const loading = useMemo(() => getAsyncTeamsEntity(state).fetch.status === AsyncStatus.Busy, [state]);
    const teams = useMemo(() => getAsyncTeams(state), [state]);
    const ref = useRef(null);

    useEffect(() => {
        if (open) {
            triggerFetchTeams({
                pagination: {
                    page: 1,
                    size: 10,
                },
                filter: {
                    name: input.length > 0 && input,
                },
                sort: 'name,asc',
            });
        }
    }, [open, input]);

    const handleChange = (_: React.ChangeEvent<{}>, value: ITeam) => {
        setTeam(value);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = () => {
        if (team) {
            onSubmit(team);
        }
        setOpen(false);
    };

    return (
        <>
            {
                userTeams.length > 0
                    ? (
                        <OrderedList
                            items={userTeams.map((teamItem, index) => ({
                                content: teamItem.name,
                                selected: selectedIndex === index,
                                button: true,
                                onSelect: () => onTeamSelected(index),
                            }))}
                        />
                    ) : (
                        <Typography variant="body2">
                            <Translate msg="connections.detail.side.environments.empty" />
                        </Typography>
                    )
            }
            {checkAuthorityGeneral(state, SECURITY_PRIVILEGES.S_USERS_WRITE)
                && (
                    <Button
                        variant="outlined"
                        color="default"
                        size="small"
                        disableElevation
                        onClick={() => setOpen(true)}
                    >
                        <Translate msg="users.detail.side.teams.add_button" />
                    </Button>
                )}
            <ClosableDialog
                onClose={() => setOpen(true)}
                open={open}
                title={translator('users.detail.side.teams.add_dialog.select_title')}
                maxWidth="lg"
            >
                <Box marginX="auto" width="100%">
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        width="100%"
                    >
                        <Box marginBottom={2} width="100%">
                            <FormControl className={classes.select}>
                                <Autocomplete
                                    ref={ref}
                                    id="user-teams"
                                    getOptionLabel={(option: ITeam) => option.teamName}
                                    onInputChange={(_, newValue) => setInput(newValue)}
                                    onChange={handleChange}
                                    options={teams}
                                    loading={loading}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Teams"
                                            variant="outlined"
                                        />
                                    )}
                                    freeSolo
                                />
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
                <Box display="flex" width="100%" justifyContent="flex-end" className={classes.footer}>
                    <ButtonGroup size="small">
                        <Button
                            variant="outlined"
                            color="default"
                            size="small"
                            onClick={handleClose}
                        >
                            <Translate
                                msg="users.detail.side.teams.add_dialog.cancel"
                            />
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={handleSubmit}
                        >
                            <Translate
                                msg="users.detail.side.teams.add_dialog.add"
                            />
                        </Button>
                    </ButtonGroup>
                </Box>
            </ClosableDialog>
        </>
    );
}

export default observe<IPublicProps>([
    StateChangeNotification.IAM_TEAMS_LIST,
    StateChangeNotification.I18N_TRANSLATIONS,
], EditTeamsDialog);
