import React from 'react';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import {
    Typography,
    withStyles,
    WithStyles,
    createStyles,
    AppBar,
    Toolbar,
    IconButton,
    Theme,
    Box,
} from '@material-ui/core';
import { Menu as MenuIcon, Brightness4 as BrightnessIcon } from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';
import { TThemeName } from 'config/theme.config';
import packageJson from '../../../../package.json';

interface IPublicProps {
    toggleTheme: () => void;
    currentTheme: TThemeName;
}

const styles = ({ spacing, palette }: Theme) => createStyles({
    appBar: {
        backgroundColor: palette.primary.light,
        color: palette.primary.main,
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderBottomColor: grey[200],
    },
    title: {
        fontWeight: 700,
        margin: spacing(1),
    },
    brand: {
        flexGrow: 1,
    },
    action: {
        paddingLeft: spacing(1),
        paddingRight: spacing(1),
        borderLeft: '1px solid',
        borderLeftColor: grey[200],
    },
    icon: {
        color: palette.primary.dark,
    },
});

function AppHeader({
    classes,
    toggleTheme,
}: IPublicProps & WithStyles<typeof styles>) {
    return (
        <AppBar position="static" className={classes.appBar}>
            <Toolbar>
                <Box display="flex" flexDirection="row" alignItems="baseline" className={classes.brand}>
                    <Typography variant="h4" className={classes.title}>
                        <Translate msg="app_shell.header.title" raw />
                    </Typography>
                    <span>{packageJson.version}</span>
                </Box>
                <div className={classes.action}>
                    <IconButton className={classes.icon} aria-label="theme-toggle" onClick={toggleTheme}>
                        <BrightnessIcon />
                    </IconButton>
                </div>
                <div className={classes.action}>
                    <IconButton className={classes.icon} aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default withStyles(styles)(AppHeader);
