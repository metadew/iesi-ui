import React, { ReactNode } from 'react';
import { NavLink as RouterNavLink, NavLinkProps } from 'react-router-dom';
import isSet from '@snipsonian/core/es/is/isSet';
import { makeStyles, Theme } from '@material-ui/core';
import { getRoute, ROUTE_KEYS } from 'views/routes';

interface IPublicProps extends Pick<NavLinkProps, 'exact'> {
    to: ROUTE_KEYS;
    payload?: IPlaceholders;
    flashMessageLink?: boolean;
    children: ReactNode;
}

interface IPlaceholders {
    [key: string]: number | string;
}

const ACTIVE_CLASS_NAME = 'active';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        color: theme.palette.text.primary,
        '&.active': {
            color: theme.palette.primary.main,
        },
    },
    flashMessageLink: {
        color: 'inherit',
    },
}));

function RouteLink(props: IPublicProps) {
    const { to: routeKey, payload, exact, flashMessageLink, children } = props;
    const classes = useStyles();

    const route = getRoute({ routeKey });

    const shouldMatchExact = isSet(exact)
        ? exact
        : false;

    const urlTo = replacePathPlaceholders({
        path: route.path,
        placeholders: payload,
    });

    return (
        <RouterNavLink
            to={urlTo}
            exact={shouldMatchExact}
            activeClassName={ACTIVE_CLASS_NAME}
            className={flashMessageLink ? classes.flashMessageLink : classes.root}
        >
            {children}
        </RouterNavLink>
    );
}

export default RouteLink;

function replacePathPlaceholders({
    path,
    placeholders = {},
}: {
    path: string;
    placeholders?: IPlaceholders;
}): string {
    const placeholderNames = Object.getOwnPropertyNames(placeholders);

    return placeholderNames.reduce(
        (prevPathResult, placeholderName) => {
            const placeholderValue = placeholders[placeholderName];

            const regex = new RegExp(`:${placeholderName}`, 'g');

            return prevPathResult.replace(regex, placeholderValue && placeholderValue.toString());
        },
        path,
    );
}
