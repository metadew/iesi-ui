import React from 'react';
import { NavLink as RouterNavLink, NavLinkProps } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core';

type IPublicProps = NavLinkProps;

const ACTIVE_CLASS_NAME = 'active';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        color: theme.palette.text.primary,
        '&.active': {
            color: theme.palette.primary.main,
        },
    },
}));

function NavLink(props: IPublicProps) {
    const { to, children, exact } = props;
    const classes = useStyles();

    return (
        <RouterNavLink
            to={to}
            exact={exact}
            activeClassName={ACTIVE_CLASS_NAME}
            className={classes.root}
        >
            {children}
        </RouterNavLink>
    );
}

export default NavLink;
