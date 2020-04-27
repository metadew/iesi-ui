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
import { Brightness4 as BrightnessIcon } from '@material-ui/icons';
import RouteLink from 'views/common/navigation/RouteLink';
import { TThemeName } from 'config/theme.config';
import { ROUTE_KEYS } from 'views/routes';
import packageJson from '../../../../package.json';
import NavigationMenu from './NavigationMenu';

interface IPublicProps {
    toggleTheme: () => void;
    currentTheme: TThemeName;
}

const styles = ({ spacing, palette, typography }: Theme) =>
    createStyles({
        appBar: {
            backgroundColor: palette.background.paper,
            color: palette.primary.main,
            boxShadow: 'none',
            borderBottom: '1px solid',
            borderBottomColor: palette.divider,
        },
        title: {
            fontWeight: 700,
            margin: spacing(1),
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
            borderLeftColor: palette.divider,
            color: palette.primary.dark,
            fontSize: typography.pxToRem(30),
        },
    });

function AppHeader({
    classes,
    toggleTheme,
}: IPublicProps & WithStyles<typeof styles>) {
    return (
        <AppBar position="static" className={classes.appBar}>
            <Toolbar>
                <div className={classes.brandContainer}>
                    <RouteLink to={ROUTE_KEYS.R_HOME} className={classes.brand}>
                        <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="baseline"
                        >
                            <Typography variant="h4" className={classes.title}>
                                <Translate msg="app_shell.header.title" raw />
                            </Typography>
                            <span>{packageJson.version}</span>
                        </Box>
                    </RouteLink>
                </div>
                <div className={classes.action}>
                    <IconButton
                        aria-label="theme-toggle"
                        onClick={toggleTheme}
                        color="default"
                        style={{ fontSize: 'inherit' }}
                    >
                        <BrightnessIcon style={{ fontSize: 'inherit' }} />
                    </IconButton>
                </div>
                <div className={classes.action}>
                    <NavigationMenu />
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default withStyles(styles)(AppHeader);
