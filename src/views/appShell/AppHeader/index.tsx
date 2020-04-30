import React from 'react';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import {
    Typography,
    AppBar,
    Toolbar,
    IconButton,
    Theme,
    Box,
    makeStyles,
} from '@material-ui/core';
import { Brightness4 as BrightnessIcon } from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';
import RouteLink from 'views/common/navigation/RouteLink';
import { TThemeName } from 'config/theme.config';
import { ROUTE_KEYS } from 'views/routes';
import packageJson from '../../../../package.json';
import NavigationMenu from './NavigationMenu';

interface IPublicProps {
    toggleTheme: () => void;
    currentTheme: TThemeName;
}

const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
    appBar: {
        backgroundColor: grey[50],
        color: palette.primary.main,
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderBottomColor: grey[200],
    },
    toolBar: {
        paddingLeft: spacing(6),
        paddingRight: spacing(6),
    },
    title: {
        fontWeight: 700,
        marginRight: spacing(1),
    },
    brandContainer: {
        flexGrow: 1,
    },
    brand: {
        display: 'inline-block',
    },
    action: {
        paddingLeft: spacing(1),
        paddingRight: spacing(1),
        borderLeft: '1px solid',
        borderLeftColor: grey[200],
    },
    actionButton: {
        color: palette.primary.dark,
    },
}));

function AppHeader({
    toggleTheme,
}: IPublicProps) {
    const classes = useStyles();

    return (
        <AppBar position="static" className={classes.appBar}>
            <Toolbar className={classes.toolBar}>
                <div className={classes.brandContainer}>
                    <RouteLink to={ROUTE_KEYS.R_HOME} className={classes.brand}>
                        <Box display="flex" flexDirection="row" alignItems="baseline">
                            <Typography variant="h4" className={classes.title}>
                                <Translate msg="app_shell.header.title" raw />
                            </Typography>
                            <span>{packageJson.version}</span>
                        </Box>
                    </RouteLink>
                </div>
                <div className={classes.action}>
                    <IconButton aria-label="theme-toggle" onClick={toggleTheme} className={classes.actionButton}>
                        <BrightnessIcon />
                    </IconButton>
                </div>
                <div className={classes.action}>
                    <NavigationMenu buttonClassName={classes.actionButton} />
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default AppHeader;
