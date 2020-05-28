import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { Box, Button, makeStyles } from '@material-ui/core';
import { THEME_COLORS } from 'config/themes/colors';

interface IPublicProps {
    buttonText: string | ReactNode;
    children: ReactNode;
    isOpen: boolean;
    onOpenIntent: () => void;
    onCloseIntent: () => void;
    forwardRef?: React.RefObject<HTMLDivElement>;
}

const useStyles = makeStyles(({ palette, shape }) => ({
    root: {
        position: 'relative',
        zIndex: 1,
        '&.is-open': {
            zIndex: 2,
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
        backgroundColor: palette.background.paper,
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
    const { buttonText, children, isOpen, onOpenIntent, onCloseIntent, forwardRef } = props;

    return (
        <Box
            className={classNames(classes.root, {
                'is-open': !!isOpen,
            })}
            {...{ ref: forwardRef }}
        >
            <Button
                className={classes.button}
                color="default"
                variant="outlined"
                size="small"
                onClick={isOpen ? onCloseIntent : onOpenIntent}
            >
                {buttonText}
            </Button>
            <Box padding={1.5} className={classes.content}>{children}</Box>
        </Box>
    );
}
