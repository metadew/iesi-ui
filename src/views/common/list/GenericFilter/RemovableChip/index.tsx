import { Box, Chip, makeStyles } from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';
import React from 'react';
import InfoTooltip from 'views/common/tooltips/InfoTooltip';

interface IPublicProps {
    text: string;
    onDelete: () => void;
    truncateLength: number;
}

const useStyles = makeStyles(({ spacing, typography, shape }) => ({
    chip: {
        marginRight: spacing(1),
        marginBottom: spacing(1),
        borderRadius: shape.borderRadius,
        fontWeight: typography.fontWeightBold,
        '&.MuiChip-sizeSmall': {
            height: typography.pxToRem(18),
            fontSize: typography.pxToRem(10),
            '& .MuiSvgIcon-root': {
                width: typography.pxToRem(13),
                height: typography.pxToRem(13),
            },
        },
        '& .MuiSvgIcon-root': {
            color: 'currentColor',
        },
    },
    tooltip: {
        top: 0,
    },
}));

export default function RemovableChip({
    text,
    onDelete,
    truncateLength,
}: IPublicProps) {
    const classes = useStyles();
    const truncate = text && (text.length > truncateLength);
    return (
        <Chip
            label={(
                <Box display="flex" alignItems="center">
                    <Box>{truncate ? `${text.substr(0, truncateLength)}...` : text}</Box>
                    {truncate && (
                        <Box>
                            <InfoTooltip className={classes.tooltip} title={text} iconSize="small" />
                        </Box>
                    )}
                </Box>
            )}
            onDelete={onDelete}
            className={classes.chip}
            size="small"
            deleteIcon={<CloseRounded />}
        />
    );
}
