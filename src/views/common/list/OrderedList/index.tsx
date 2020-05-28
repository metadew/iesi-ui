import React, { ReactNode } from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';

interface IPublicProps {
    items: IOrderedListItem[];
}

interface IOrderedListItem {
    id?: string;
    content: string | ReactNode;
    onDelete?: () => void;
}

const useStyles = makeStyles(({ palette, spacing, shape, transitions, typography }) => ({
    list: {
        counterReset: 'ordered-list-counter',
        listStyle: 'none',
        padding: 0,
    },
    item: {
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        paddingLeft: spacing(2.5),
        margin: `${spacing(0.3)}px 0`,
        counterIncrement: 'ordered-list-counter',
        '&:before': {
            content: 'counter(ordered-list-counter)',
            position: 'absolute',
            top: spacing(0.1),
            left: 0,
            width: spacing(1.7),
            height: spacing(1.7),
            background: palette.text.primary,
            borderRadius: shape.borderRadius,
            color: palette.background.paper,
            fontSize: typography.pxToRem(10),
            fontWeight: typography.fontWeightBold,
            textAlign: 'center',
            lineHeight: `${spacing(1.7)}px`,
        },
    },
    itemContent: {
        flex: '1 1 auto',
    },
    itemActions: {
        flex: '0 1 auto',
    },
    itemActionButton: {
        padding: 0,
        marginTop: spacing(-0.2),
        '&.MuiIconButton-root': {
            transitionProperty: 'color',
            transitionTimingFunction: transitions.easing.easeInOut,
            transitionDuration: `${transitions.duration.shortest}ms`,
            '&:hover': {
                backgroundColor: 'transparent',
                color: palette.error.main,
            },
        },
    },
}));

const OrderedList = ({ items }: IPublicProps) => {
    const classes = useStyles();

    return (
        <ol className={classes.list}>
            {items.map((item, index) => (
                <li key={item.id || index} className={classes.item}>
                    <div className={classes.itemContent}>{item.content}</div>
                    {typeof item.onDelete === 'function' && (
                        <div className={classes.itemActions}>
                            <IconButton
                                aria-label="delete item"
                                onClick={item.onDelete}
                                className={classes.itemActionButton}
                                disableRipple
                            >
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    )}
                </li>
            ))}
        </ol>
    );
};

export default OrderedList;
