import React from 'react';
import { makeStyles } from '@material-ui/core';
import { ROUTE_KEYS } from 'views/routes';

const useStyles = makeStyles(() => ({
    anchor: {
        textDecoration: 'none',
        color: 'inherit',
    },
}));

interface ILinkProps {
    href: ROUTE_KEYS;
    params?: {
        [key: string]: string | number;
    };
}

interface IPublicProps {
    children: React.ReactNode;
}

function buildHref({ href, params }: ILinkProps) {
    let builtHref = href.toString();
    const notFoundPattern = new RegExp('{(.*?)}');

    Object.keys(params).forEach((key) => {
        const pattern = new RegExp(`{${key}}`);
        builtHref = builtHref.replace(pattern, params[key].toString());
    });

    const notFoundMatch = notFoundPattern.exec(builtHref);

    if (notFoundMatch && notFoundMatch.length) {
        console.error('ERROR: ', notFoundMatch[0], 'is a required path param');
    }

    return builtHref;
}

export default function LinkIcon({ children, href, params = {} }: IPublicProps & ILinkProps) {
    const classes = useStyles();

    return (
        <a href={buildHref({ href, params })} className={classes.anchor}>
            {children}
        </a>
    );
}
