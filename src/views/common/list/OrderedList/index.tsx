import React, { ReactNode, FC, ComponentProps } from 'react';
import {
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Typography,
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { THEME_COLORS } from 'config/themes/colors';

interface IPublicProps {
    items: IOrderedListItem[];
}

interface IOrderedListItem {
    id?: string;
    content: string | ReactNode;
    selected?: boolean;
    button?: boolean;
    onSelect?: () => void;
    onDelete?: () => void;
}

const useStyles = makeStyles(({ palette, spacing, shape, transitions, typography }) => ({
    list: {
        counterReset: 'ordered-list-counter',
        listStyle: 'none',
        padding: 0,
    },
    counter: {
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
    itemSelected: {
        backgroundColor: THEME_COLORS.GREY_LIGHT,
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
        <List className={classes.list}>
            {items.map((item, index) => (
                <ListItemOverride
                    key={item.id || index}
                    onClick={item.onSelect}
                    selected={item.selected}
                    button={item.button}
                >
                    <ListItemIcon>
                        <Typography className={classes.counter}>{index}</Typography>
                    </ListItemIcon>
                    <ListItemText primary={item.content} />
                    {
                        typeof item.onDelete === 'function' && (
                            <ListItemSecondaryAction>
                                <IconButton
                                    aria-label="delete item"
                                    onClick={item.onDelete}
                                    className={classes.itemActionButton}
                                    disableRipple
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        )
                    }
                </ListItemOverride>
            ))}
        </List>
    );
};

/**
 * ListItem button props cannot be dynamic : Type 'boolean' is not assignable to type 'true'
 * The ListItem is overriden to be able to receive boolean value
 * issue : https://github.com/mui-org/material-ui/issues/14971
 */

type PropTypes = Omit<ComponentProps<typeof ListItem>, 'button'> & { button?: boolean };
const ListItemOverride: FC<PropTypes> = (props) => (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <ListItem {...props} button={props.button as any}>
        {props.children}
    </ListItem>
);

export default OrderedList;
