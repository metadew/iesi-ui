import React from 'react';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { Button, makeStyles } from '@material-ui/core';
import { ChevronLeftRounded } from '@material-ui/icons';
import { ROUTE_KEYS } from 'views/routes';
import RouteLink, { IPublicProps as IRouteLinkProps } from '../RouteLink';

interface IPublicProps {
    to: ROUTE_KEYS;
}

const useStyles = makeStyles(() => ({
    goBackButton: {
        paddingRight: '1em',
        borderRadius: '0 1.5em 1.5em 0',
    },
}));

// https://material-ui.com/guides/composition/#caveat-with-refs
const RouteLinkRef = React.forwardRef<HTMLAnchorElement, IRouteLinkProps>((props, ref) => (
    <RouteLink innerRef={ref} {...props} />
));

function GoBack(props: IPublicProps) {
    const classes = useStyles();
    return (
        <Button
            variant="contained"
            color="default"
            startIcon={<ChevronLeftRounded />}
            disableElevation
            component={RouteLinkRef}
            to={props.to}
            className={classes.goBackButton}
        >
            <Translate msg="common.navigation.go_back" />
        </Button>
    );
}

export default GoBack;
