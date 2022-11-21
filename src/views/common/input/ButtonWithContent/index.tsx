import React, { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Box, Button, makeStyles } from '@material-ui/core';
import { THEME_COLORS } from 'config/themes/colors';

interface IPublicProps {
    buttonText: string | ReactNode;
    children: ReactNode;
    isOpen: boolean;
    onOpenIntent: () => void;
    onCloseIntent: () => void;
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
        },
        '.is-open:not(.open-top) > &': {
            borderBottomColor: 'transparent',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
        },
        '.is-open.open-top > &': {
            borderTopColor: 'transparent',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
        },
    },
    content: {
        position: 'absolute',
        top: 'calc(100% - 1px)',
        left: '0',
        right: '0',
        zIndex: 2,
        opacity: 0,
        backgroundColor: palette.background.paper,
        border: '1px solid',
        borderColor: THEME_COLORS.GREY,
        borderRadius: shape.borderRadius,
        borderTopLeftRadius: 0,
        '.open-top > &': {
            bottom: 'calc(100% - 1px)',
            top: 'auto',
            borderTopLeftRadius: shape.borderRadius,
            borderBottomLeftRadius: 0,
        },
        '.is-open > &': {
            opacity: 1,
        },
    },
}));

export default function ButtonWithContent(props: IPublicProps) {
    const classes = useStyles();
    const buttonRef = useRef<HTMLButtonElement>();
    const contentRef = useRef<HTMLDivElement>();
    const [contentDimensions, setContentDimensions] = useState({ width: 0, height: 0 });
    const [showBelow, setShowBelow] = useState(true);
    const { buttonText, children, isOpen, onOpenIntent, onCloseIntent } = props;

    const handleOnOpen = () => {
        if (buttonRef.current && contentRef.current) {
            const buttonBoundingClientRect = buttonRef.current.getBoundingClientRect();
            const spaceAvailableBelowButton = window.innerHeight
                - (buttonBoundingClientRect.top + buttonBoundingClientRect.height);

            const enoughSpaceAvailableBelowButton = contentDimensions.height < spaceAvailableBelowButton;
            setShowBelow(enoughSpaceAvailableBelowButton);
        }

        if (typeof onOpenIntent !== 'undefined') {
            onOpenIntent();
        }
    };

    useLayoutEffect(() => {
        if (contentRef && contentRef.current) {
            setContentDimensions({
                width: contentRef.current.offsetWidth,
                height: contentRef.current.offsetHeight,
            });
        }
    }, []);

    return (
        <Box
            className={classNames(classes.root, {
                'is-open': !!isOpen,
                'open-top': !showBelow,
            })}
        >
            <Button
                className={classes.button}
                color="default"
                variant="outlined"
                size="small"
                onClick={isOpen ? onCloseIntent : handleOnOpen}
                ref={buttonRef}
            >
                {buttonText}
            </Button>
            <Box
                padding={1.5}
                className={classes.content}
                {...{ ref: contentRef }}
            >
                {children}
            </Box>
        </Box>
    );
}
