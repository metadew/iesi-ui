import React from 'react';
import { Button, ButtonProps, makeStyles } from '@material-ui/core';
import { ROUTE_KEYS } from 'views/routes';

const useStyles = makeStyles(() => ({
    anchor: {
        textDecoration: 'none',
    },
}));

interface IPublicProps {
    href: ROUTE_KEYS;
    params?: {
        [key: string]: string | number;
    };
}

function buildHref({ href, params }: IPublicProps) {
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

export default function LinkButton({ children, href, params = {}, ...props }: IPublicProps & ButtonProps) {
    const classes = useStyles();

    return (
        <a href={buildHref({ href, params })} className={classes.anchor}>
            <Button {...props}>
                {children}
            </Button>
        </a>
    );
}
