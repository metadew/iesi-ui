import React, { useEffect, useState } from 'react';
import { Box, darken, IconButton, makeStyles } from '@material-ui/core';
import AccentureIcon from 'views/common/icons/Accenture';
import { THEME_COLORS } from 'config/themes/colors';
import { Route, Switch, useLocation } from 'react-router-dom';
import { getRoute } from 'views/routes';
import { IObserveProps, observe } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { getAllowedParentRouteKeys } from 'state/auth/selectors';
import Cookie from 'js-cookie';
import LoginView from '../AppLogIn/LoginPage';
import PrivateRoute from '../AppLogIn/components/PrivateRoute';

interface IPublicProps {
    offsetTop: number;
}

const useStyles = makeStyles(({ palette, spacing, typography }) => ({
    accentureLogo: {
        position: 'absolute',
        bottom: spacing(2),
        right: spacing(2),
        color: THEME_COLORS.GREY,
        fontSize: typography.pxToRem(27),
        '& .MuiIconButton-root': {
            color: 'currentColor',
            backgroundColor:
                palette.type === 'light'
                    ? THEME_COLORS.GREY_LIGHT
                    : darken(THEME_COLORS.GREY_DARK, 0.2),
        },
    },
}));

function AppBody({ state, offsetTop }: IObserveProps & IPublicProps) {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();
    const encryptedCookie = Cookie.get('app_session');

    useEffect(() => {
        const checkToken = async () => {
            if (encryptedCookie) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        };

        checkToken();
    }, [encryptedCookie, location.pathname]);

    if (isLoading) {
        return <></>;
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            flex="1 0 auto"
            paddingTop={offsetTop > 0 ? `${offsetTop}px` : 0}
            maxWidth="100vw"
            overflow="hidden"
        >
            <Switch>
                <Route path="/login" component={LoginView} />
                {getAllowedParentRouteKeys(state).map((routeKey) => {
                    const { path, exact, component, template } = getRoute({
                        routeKey,
                    });

                    const parentComponent = template
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ? (template as React.ComponentType<any>)
                        : component;

                    return (
                        <PrivateRoute
                            key={routeKey}
                            state={state}
                            path={path}
                            exact={exact}
                            component={parentComponent}
                            isAuthenticated={isAuthenticated}
                        />
                    );
                })}
            </Switch>
            <Box className={classes.accentureLogo}>
                <IconButton
                    aria-label="accenture"
                    color="default"
                    style={{ fontSize: 'inherit' }}
                    href="https://metadew.github.io/iesi/"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <AccentureIcon
                        style={{ fontSize: 'inherit' }}
                    />
                </IconButton>
            </Box>
        </Box>
    );
}

export default observe<IPublicProps>(
    [StateChangeNotification.AUTH],
    AppBody,
);
