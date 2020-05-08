import React, { ReactNode, useState } from 'react';
import classNames from 'classnames';
import { Box, Button, makeStyles } from '@material-ui/core';
import { THEME_COLORS } from 'config/themes/colors';

interface IPublicProps {
    buttonText: string;
    children: ReactNode;
}

const useStyles = makeStyles(({ palette, shape }) => ({
    root: {
        position: 'relative',
        zIndex: 1,
        '&.is-open': {
        },
    },
    button: {
        position: 'relative',
        zIndex: 3,
        backgroundColor: palette.background.paper,
        '.is-open > &': {
            borderColor: THEME_COLORS.GREY,
            borderBottomColor: 'transparent',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
        },
    },
    content: {
        position: 'absolute',
        top: 'calc(100% - 1px)',
        left: '0',
        right: '0',
        zIndex: 2,
        display: 'none',
        border: '1px solid',
        borderColor: THEME_COLORS.GREY,
        borderRadius: shape.borderRadius,
        borderTopLeftRadius: 0,
        '.is-open > &': {
            display: 'block',
        },
    },
}));

export default function ButtonWithContent(props: IPublicProps) {
    const classes = useStyles();
    const { buttonText, children } = props;
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Box
            className={classNames(classes.root, {
                'is-open': !!isOpen,
            })}
        >
            <Button
                className={classes.button}
                color="default"
                variant="outlined"
                size="small"
                onClick={() => setIsOpen(!isOpen)}
            >
                {buttonText}
            </Button>
            <Box padding={1.5} className={classes.content}>{children}</Box>
        </Box>
    );
}
