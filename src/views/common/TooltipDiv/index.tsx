import React, { useEffect, useRef, useState } from 'react';
import { Box, makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import InfoTooltip from '../tooltips/InfoTooltip';

interface IPublicProps {
    text: string;
    className?: string;
}

const useStyles = makeStyles(() => ({
    item: {
        overflow: 'hidden',
        maxHeight: '1.2em',
        lineHeight: '1.2em',
    },
    itemWithTooltip: {
        position: 'relative',
        width: '100%',
        height: '1.2em',
        overflow: 'visible',
    },
    itemWithTooltipInner: {
        position: 'absolute',
        left: 0,
        right: 0,
    },
    itemWithTooltipClippedText: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
}));

export default function TooltipDiv({
    text,
    className,
}: IPublicProps) {
    const classes = useStyles();
    const boxRef = useRef<HTMLDivElement>();
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        if (!showTooltip && (boxRef.current.scrollHeight - 1) > boxRef.current.offsetHeight) {
            setShowTooltip(true);
        }
    }, [showTooltip]);

    if (showTooltip) {
        return (
            <Box className={classNames(classes.item, classes.itemWithTooltip, className)}>
                <Box display="flex" className={classes.itemWithTooltipInner}>
                    <Box flex="0 1 auto" className={classes.itemWithTooltipClippedText}>
                        {text}
                    </Box>
                    <Box flex="0 0 auto">
                        <InfoTooltip title={text} iconSize="small" />
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            className={classNames(classes.item, className)}
            {...{ ref: boxRef }}
        >
            {text}
        </Box>
    );
}
