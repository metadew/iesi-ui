import React, { useState, Ref } from 'react';
import classNames from 'classnames';
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
import RouteLink from 'views/common/navigation/RouteLink';
import { TThemeName } from 'config/theme.config';
import { ROUTE_KEYS } from 'views/routes';
import { useDocumentScrollThrottled } from 'utils/document/throttledEvents';
import packageJson from '../../../../package.json';
import NavigationMenu from './NavigationMenu';

interface IPublicProps {
    toggleTheme: () => void;
    currentTheme: TThemeName;
    forwardRef?: Ref<HTMLElement>;
}

const MINIMUM_SCROLL = 80;

const useStyles = makeStyles(({ palette, spacing, transitions, shadows, typography }: Theme) => ({
    appBar: {
        top: 0,
        left: 0,
        backgroundColor: palette.background.paper,
        color: palette.primary.main,
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderBottomColor: palette.divider,
        transitionProperty: 'transform',
        transitionTimingFunction: transitions.easing.sharp,
        transitionDuration: `${transitions.duration.leavingScreen}ms`,
    },
    appBarHidden: {
        // Extra 10px for the box shadow
        transform: 'translate3d(0, -100%, 0) translate3d(0, -10px, 0)',
    },
    appBarFixed: {
        boxShadow: shadows[3],
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
}));

function AppHeader({
    toggleTheme,
    forwardRef,
}: IPublicProps) {
    const classes = useStyles();
    const [shouldHideHeader, setShouldHideHeader] = useState(false);
    const [shouldShowShadow, setShouldShowShadow] = useState(false);

    useDocumentScrollThrottled((callbackData) => {
        const { previousScrollTop, currentScrollTop } = callbackData;
        const isScrolledDown = previousScrollTop < currentScrollTop;
        const isMinimumScrolled = currentScrollTop > MINIMUM_SCROLL;

        setShouldShowShadow(currentScrollTop > 2);
        setShouldHideHeader(isScrolledDown && isMinimumScrolled);
    });

    return (
        <AppBar
            position="fixed"
            className={classNames(classes.appBar, {
                [classes.appBarHidden]: !!shouldHideHeader,
                [classes.appBarFixed]: !!shouldShowShadow,
            })}
            ref={forwardRef}
        >
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

export default AppHeader;
