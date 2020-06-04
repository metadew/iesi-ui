import React, { ReactText, useState } from 'react';
import { THEME_COLORS } from 'config/themes/colors';
import classNames from 'classnames';
import { getListItemValueFromColumn } from 'utils/list/list';
import {
    TableCell,
    Typography,
    IconButton,
    Theme,
    Box,
    makeStyles,
    TableRow,
    Checkbox,
    Menu,
    MenuItem,
    ListItemIcon,
    darken,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
    IListItem,
    ListColumns,
    IColumn,
    IListAction,
} from 'models/list.models';
import {
    DraggableProvidedDragHandleProps,
    DraggableProvidedDraggableProps,
} from 'react-beautiful-dnd';
import { formatNumberWithTwoDigits } from 'utils/number/format';
import isSet from '@snipsonian/core/es/is/isSet';
import Tooltip from 'views/common/Tooltip';
import DragHandlerIcon from 'views/common/icons/DragHandler';

const SHORTEN_VALUE_FROM_CHARACTERS = 40;

interface IPublicProps<ColumnNames> {
    index: number;
    item: IListItem<ColumnNames>;
    columns: ListColumns<ColumnNames>;
    listActions?: IListAction[];
    draggableProps?: DraggableProvidedDraggableProps & DraggableProvidedDragHandleProps & {
        ref(element?: HTMLElement | null): unknown;
    };
    showIndex?: boolean;
    isDragging?: boolean;
    disableElevation?: boolean;
    selectable?: {
        onSelect: (id: ReactText) => void;
        selected: boolean;
    };
    className?: string;
}

const useStyles = makeStyles(({ breakpoints, palette, shape, typography, spacing }: Theme) => ({
    tableRow: {
        background: palette.background.paper,
        height: '100%',
    },
    tableRowElevated: {
        boxShadow: '0 2px 22px rgba(0, 0, 0, .10)',
        borderRadius: shape.borderRadius,
    },
    tableRowIsDragging: {
        borderSpacing: 0,
    },
    tableCell: {
        height: '100%',
    },
    hideOnCompactView: {
        [breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    label: {
        fontSize: '.8rem',
        color: palette.grey[500],
    },
    actionsCell: {
        position: 'relative',
        '&.MuiTableCell-root': {
            paddingLeft: `${spacing(1.1)}px !important`,
            paddingRight: `${spacing(1.1)}px !important`,
            borderTopRightRadius: shape.borderRadius,
            borderBottomRightRadius: shape.borderRadius,
            '&:before': {
                content: 'normal !important',
            },
        },
    },
    actionsCellCompact: {
        [breakpoints.up('md')]: {
            display: 'none',
        },
    },
    actionsWrapper: {
        display: 'inline-flex',
        height: '100%',
        alignItems: 'stretch',
    },
    actionsItem: {
        display: 'flex',
        alignItems: 'center',
        flex: '0 0 auto',
        padding: spacing(0.5),
        '& + &': {
            borderLeft: '1px solid',
            borderLeftColor: THEME_COLORS.GREY,
        },
    },
    actionIcon: {
        padding: spacing(1),
        '& .MuiSvgIcon-root': {
            fontSize: typography.pxToRem(20),
        },
    },
    actionsMenu: {
        backgroundColor: palette.type === 'light'
            ? THEME_COLORS.GREY_LIGHT
            : darken(THEME_COLORS.GREY_DARK, 0.2),
    },
    actionsMenuItem: {
        fontWeight: typography.fontWeightBold,
        '& .MuiSvgIcon-root': {
            fontSize: typography.pxToRem(20),
        },
        '& .MuiListItemIcon-root': {
            minWidth: '36px',
        },
    },
    index: {
        width: 50,
        fontWeight: typography.fontWeightBold,
        textAlign: 'center',
    },
}));

export default function GenericTableRow<ColumnNames>({
    item,
    columns,
    listActions,
    draggableProps,
    showIndex,
    isDragging,
    disableElevation,
    selectable,
    className,
    index: rowIndex,
}: IPublicProps<ColumnNames>) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <TableRow
            className={classNames(classes.tableRow, className, {
                [classes.tableRowElevated]: !disableElevation,
                [classes.tableRowIsDragging]: !!isDragging,
            })}
            {...draggableProps}
        >
            {isSet(draggableProps) && (
                <TableCell className={classNames(classes.tableCell, 'drag-handle')}>
                    <DragHandlerIcon fontSize="inherit" />
                </TableCell>
            )}
            {isSet(showIndex) && (
                <TableCell className={classes.tableCell}>
                    <Typography className={classes.index}>{formatNumberWithTwoDigits(rowIndex)}</Typography>
                </TableCell>
            )}
            {Object.keys(columns).map((untypedColumnName) => {
                const columnName = (untypedColumnName as unknown) as keyof ColumnNames;
                const column = columns[columnName] as IColumn<ColumnNames>;

                const value = getListItemValueFromColumn(item, columnName).toString();
                const shortenedValue = value.length > SHORTEN_VALUE_FROM_CHARACTERS
                    ? `${value.substr(0, SHORTEN_VALUE_FROM_CHARACTERS)}...`
                    : value;

                const cellClassName = typeof column.className === 'function'
                    ? column.className(value)
                    : column.className;

                const tooltip = typeof column.tooltip === 'function'
                    ? column.tooltip(value)
                    : column.tooltip;

                return (
                    <TableCell
                        className={classNames(classes.tableCell, {
                            [classes.hideOnCompactView]: !!column.hideOnCompactView,
                        })}
                        style={{ width: column.fixedWidth }}
                        key={columnName as string}
                    >
                        {column.label && (
                            <Typography
                                display="block"
                                className={classes.label}
                            >
                                {column.label}
                            </Typography>
                        )}
                        <Box display="flex" alignItems="center">
                            <Typography variant="body2" className={cellClassName}>
                                {shortenedValue}
                                {tooltip && (
                                    <Tooltip title={tooltip} iconSize="small" />
                                )}
                            </Typography>
                        </Box>
                    </TableCell>
                );
            })}
            {listActions && (
                <>
                    <TableCell
                        align="right"
                        className={classNames(classes.tableCell, classes.actionsCell, {
                            [classes.hideOnCompactView]: listActions.length > 1,
                        })}
                    >
                        <div className={classes.actionsWrapper}>
                            {listActions.map((action, listActionIndex) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <div key={listActionIndex} className={classes.actionsItem}>
                                    <IconButton
                                        onClick={() => action.onClick(item.id, rowIndex)}
                                        className={classes.actionIcon}
                                    >
                                        {action.icon}
                                    </IconButton>
                                </div>
                            ))}
                        </div>
                    </TableCell>
                    {listActions.length > 1 && (
                        <TableCell
                            align="right"
                            className={classNames(classes.tableCell, classes.actionsCell, classes.actionsCellCompact)}
                        >
                            <IconButton
                                aria-label="more"
                                aria-controls={`actions-menu-${rowIndex}`}
                                aria-haspopup="true"
                                onClick={handleClick}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id={`actions-menu-${rowIndex}`}
                                anchorEl={anchorEl}
                                keepMounted
                                open={open}
                                onClose={handleClose}
                                PaperProps={{
                                    className: classes.actionsMenu,
                                }}
                            >
                                {listActions.map((action, listActionIndex) => (
                                    <MenuItem
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={listActionIndex}
                                        onClick={() => action.onClick(item.id, rowIndex)}
                                        dense
                                        className={classes.actionsMenuItem}
                                    >
                                        <ListItemIcon>
                                            {action.icon}
                                        </ListItemIcon>
                                        <Typography variant="inherit" noWrap>{action.label}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </TableCell>
                    )}
                </>
            )}
            {selectable && (
                <TableCell
                    align="right"
                    className={classNames(classes.tableCell, classes.actionsCell)}
                >
                    <Checkbox
                        checked={selectable.selected}
                        onClick={() => selectable.onSelect(item.id)}
                    />
                </TableCell>
            )}
        </TableRow>
    );
}
