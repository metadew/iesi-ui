import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core';
import { Link, LinkGetProps } from '@reach/router';
import { ROUTES } from '../../routes';

interface IPublicProps {
    route: ROUTES | string; // for url params
    className?: string;
    children: ReactNode;
}

const ACTIVE_CLASS_NAME = 'active';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& a': {
            color: theme.palette.text.primary,
        },
        '& a.active': {
            color: theme.palette.primary.main,
        },
    },
}));

function NavLink(props: IPublicProps) {
    const classes = useStyles();

    return (
        <span className={classes.root}>
            <Link
                to={props.route}
                getProps={({ isPartiallyCurrent, isCurrent }: LinkGetProps) => {
                    const isIndexPage = props.route === './';
                    let shouldGetActiveClass = false;

                    if (isIndexPage) {
                        shouldGetActiveClass = !!isCurrent;
                    } else {
                        shouldGetActiveClass = !!isPartiallyCurrent;
                    }

                    return {
                        className: classNames(props.className, {
                            [ACTIVE_CLASS_NAME]: !!shouldGetActiveClass,
                        }),
                    };
                }}
            >
                {props.children}
            </Link>
        </span>
    );
}

export default NavLink;
