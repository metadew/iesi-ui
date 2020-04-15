import React from 'react';
import { NavLink as RouterNavLink, NavLinkProps } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core';

interface IPublicProps extends NavLinkProps {
    flashMessageLink?: boolean;
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

function NavLink(props: IPublicProps) {
    const { to, children, exact, flashMessageLink } = props;
    const classes = useStyles();

    return (
        <RouterNavLink
            to={to}
            exact={exact}
            activeClassName={ACTIVE_CLASS_NAME}
            className={flashMessageLink ? classes.flashMessageLink : classes.root}
        >
            {children}
        </RouterNavLink>
    );
}

export default NavLink;
