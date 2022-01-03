import React, { useState } from 'react';
import { observe, IObserveProps } from 'views/observe';
import { Box, Button, FormControl, InputLabel, makeStyles, Theme } from '@material-ui/core';
import { StateChangeNotification } from 'models/state.models';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import { getTranslator } from 'state/i18n/selectors';
import { checkAuthorityGeneral } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import Translate from '@snipsonian/react/es/components/i18n/Translate';

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
    teams: string[];
    selectedIndex: number;
    isCreateUserRoute: boolean;
    onTeamSelected: (index: number) => void;
    onSubmit: (team: string) => void;
    onDelete: (index: number) => void;
}

function EditTeamsDialog({ state }: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const translator = getTranslator(state);

    return (
        <>
            {checkAuthorityGeneral(state, SECURITY_PRIVILEGES.S_USERS_WRITE)
                && (
                    <Button
                        variant="outlined"
                        color="default"
                        size="small"
                        disableElevation
                        onClick={() => setOpen(true)}
                    >
                        <Translate msg="users.detail.side.environments.add_button" />
                    </Button>
                )}
            <ClosableDialog
                onClose={() => setOpen(true)}
                open={open}
                title={translator('users.detail.side.teams.add_dialog.title')}
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
                                <InputLabel id="user-team-label">Team</InputLabel>
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
            </ClosableDialog>
        </>
    );
}

export default observe<IPublicProps>([
    StateChangeNotification.ENVIRONMENTS,
    StateChangeNotification.I18N_TRANSLATIONS,
], EditTeamsDialog);
