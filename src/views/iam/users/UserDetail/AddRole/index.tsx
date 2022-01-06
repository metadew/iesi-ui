import React, { useEffect } from 'react';
import { makeStyles, Typography, Box, Paper, ButtonGroup, Button, darken } from '@material-ui/core';
import { IUserRole } from 'models/state/auth.models';
import { getTranslator } from 'state/i18n/selectors';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { THEME_COLORS } from 'config/themes/colors';
import { IObserveProps, observe } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { triggerFetchTeam } from 'state/entities/teams/triggers';
import { getAsyncTeamDetail } from 'state/entities/teams/selectors';

const useStyles = makeStyles(({ palette, typography }) => ({
    dialog: {
        background: palette.background.default,
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
        padding: 8,
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
    onAdd: (role: IUserRole) => void;
    teamName: string;
}

function AddRole({ teamName, state }: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const translator = getTranslator(state);
    const team = getAsyncTeamDetail(state).data;
    console.log(translator);
    console.log('TEAM : ', team);

    useEffect(() => {
        triggerFetchTeam({
            name: teamName,
        });
    }, [teamName]);

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
                    <Translate msg="users.detail.edit.role.title_create" />
                </Typography>
            </Box>
            <Box padding={2}>
                <Box marginBottom={2}>
                    <Paper className={classes.paper}>
                        Coucou
                    </Paper>
                </Box>
                <Box marginTop={3} textAlign="right">
                    <ButtonGroup size="small">
                        <Button
                            variant="outlined"
                            color="default"
                            onClick={() => {}}
                            disableElevation
                        >
                            <Translate msg="users.detail.edit.role.footer.cancel" />
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {}}
                            disableElevation
                        >
                            <Translate msg="users.detail.edit.role.footer.save" />
                        </Button>
                    </ButtonGroup>
                </Box>
            </Box>
        </Box>
    );
}

export default observe<IPublicProps>([
    StateChangeNotification.IAM_TEAMS_DETAIL,
], AddRole);
