import React from 'react';
import { Box, Button, darken, IconButton, makeStyles, Paper } from '@material-ui/core';
import { AddRounded as AddIcon, Delete as DeleteIcon, Save as SaveIcon } from '@material-ui/icons';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { THEME_COLORS } from 'config/themes/colors';
import Tooltip from 'views/common/tooltips/Tooltip';
import { IObserveProps, observe } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { getTranslator } from 'state/i18n/selectors';
import { checkAuthority } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';

interface IPublicProps {
    onDelete?: () => void;
    onAdd?: () => void;
    onSave?: () => void;
    isCreateRoute?: boolean;
}

const useStyles = makeStyles(({ palette, spacing }) => ({
    actions: {
        padding: `${spacing(0.5)}px ${spacing(1)}px`,
        backgroundColor: palette.type === 'light'
            ? THEME_COLORS.GREY_LIGHT
            : darken(THEME_COLORS.GREY_DARK, 0.2),
        '& .MuiIconButton-root': {
            padding: spacing(0.8),
            margin: `${spacing(0.2)}px ${spacing(0.5)}px`,
        },
    },
    addButton: {
        backgroundColor: palette.type === 'light'
            ? THEME_COLORS.GREY_LIGHT
            : darken(THEME_COLORS.GREY_DARK, 0.2),
    },
}));

function DetailActions({
    onDelete,
    onAdd,
    onSave,
    isCreateRoute,
    state,
}: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const translator = getTranslator(state);

    const DeleteButton = (
        <IconButton
            aria-label={translator('teams.details.main.actions.delete')}
            onClick={onDelete}
        >
            <DeleteIcon />
        </IconButton>
    );

    return (

        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" paddingX={2.2}>
            <Box flex="0 0 auto">
                {!isCreateRoute && checkAuthority(state, SECURITY_PRIVILEGES.S_TEAMS_WRITE)
                    ? (
                        <Tooltip
                            title={translator('teams.detail.main.actions.add_users')}
                            enterDelay={1000}
                            enterNextDelay={1000}
                        >
                            <IconButton
                                aria-label={translator('teams.detail.main.actions.add_users')}
                                className={classes.addButton}
                                onClick={onAdd}
                                color="default"
                            >
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                    )
                    : null}
            </Box>
            <Box flex="0 0 auto">
                {
                    checkAuthority(state, SECURITY_PRIVILEGES.S_TEAMS_WRITE) && (
                        <Paper elevation={0} className={classes.actions}>
                            <Box display="inline" marginRight={1}>
                                {isCreateRoute
                                    || checkAuthority(state, SECURITY_PRIVILEGES.S_TEAMS_WRITE)
                                    ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            startIcon={<SaveIcon />}
                                            onClick={onSave}
                                            disabled={!isCreateRoute}
                                        >
                                            <Translate msg="teams.detail.main.actions.save" />
                                        </Button>
                                    )
                                    : null}
                            </Box>
                            {!isCreateRoute
                                && checkAuthority(state, SECURITY_PRIVILEGES.S_TEAMS_WRITE)
                                    && (
                                        <Tooltip
                                            title={translator('teams.detail.main.actions.delete')}
                                            enterDelay={1000}
                                            enterNextDelay={1000}
                                        >
                                            {DeleteButton}
                                        </Tooltip>
                                    )}
                        </Paper>
                    )
                }
            </Box>
        </Box>
    );
}

export default observe<IPublicProps>([
    StateChangeNotification.I18N_TRANSLATIONS,
], DetailActions);
