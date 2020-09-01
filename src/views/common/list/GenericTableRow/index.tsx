import React, { ReactText, useState } from 'react';
import { THEME_COLORS } from 'config/themes/colors';
import classNames from 'classnames';
import { getListItemValueFromColumn, getListItemTooltipFromColumn } from 'utils/list/list';
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
import TooltipDiv from 'views/common/TooltipDiv';

interface IPublicProps<ColumnNames> {
    index: number;
    item?: IListItem<ColumnNames>;
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
    placeholderProps?: {
        showDraggableCell: boolean;
        showIndexCell: boolean;
    };
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
        fontSize: typography.pxToRem(12),
        color: palette.grey[500],
    },
    cellIcon: {
        '& > .MuiSvgIcon-root': {
            fontSize: typography.pxToRem(21),
        },
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
        [breakpoints.down('md')]: {
            width: '5%',
        },
    },
    actionsCellCompact: {
        width: '5%',
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
    placeholderContent: {
        backgroundColor: palette.type === 'light'
            ? THEME_COLORS.GREY_LIGHT
            : THEME_COLORS.GREY_DARK,
        minHeight: typography.pxToRem(20),
        minWidth: typography.pxToRem(40),
        borderRadius: shape.borderRadius,
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
    placeholderProps,
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

    const isPlaceholder = placeholderProps || typeof item === 'undefined';

    return (
        <TableRow
            className={classNames(classes.tableRow, className, {
                [classes.tableRowElevated]: !disableElevation,
                [classes.tableRowIsDragging]: !!isDragging,
            })}
            {...draggableProps}
        >
            {(isSet(draggableProps) || (placeholderProps && placeholderProps.showDraggableCell)) && (
                <TableCell className={classNames(classes.tableCell, 'drag-handle')}>
                    <DragHandlerIcon fontSize="inherit" />
                </TableCell>
            )}
            {isSet(showIndex || (placeholderProps && placeholderProps.showIndexCell)) && (
                <TableCell className={classes.tableCell}>
                    {!isPlaceholder ? (
                        <Typography className={classes.index}>{formatNumberWithTwoDigits(rowIndex + 1)}</Typography>
                    ) : renderPlaceholderCellContent()}
                </TableCell>
            )}
            { isPlaceholder ? renderPlaceholderCells() : renderDataCells() }
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
                                    {!isPlaceholder ? (
                                        <IconButton
                                            onClick={() => action.onClick(item.id, rowIndex)}
                                            className={classes.actionIcon}
                                        >
                                            {action.icon}
                                        </IconButton>
                                    ) : renderPlaceholderCellContent()}
                                </div>
                            ))}
                        </div>
                    </TableCell>
                    {listActions.length > 1 && (
                        <TableCell
                            align="right"
                            className={classNames(classes.tableCell, classes.actionsCell, classes.actionsCellCompact)}
                        >
                            {!isPlaceholder ? (
                                <IconButton
                                    aria-label="more"
                                    aria-controls={`actions-menu-${rowIndex}`}
                                    aria-haspopup="true"
                                    onClick={handleClick}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            ) : renderPlaceholderCellContent()}
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
                                        onClick={() => {
                                            handleClose();
                                            action.onClick(item.id, rowIndex);
                                        }}
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

    function renderDataCells() {
        return Object.keys(columns).map((untypedColumnName) => {
            const columnName = (untypedColumnName as unknown) as keyof ColumnNames;
            const column = columns[columnName] as IColumn<ColumnNames>;
            const value = getListItemValueFromColumn(item, columnName).toString();

            const cellClassName = typeof column.className === 'function'
                ? column.className(value)
                : column.className;

            const customTooltip = getListItemTooltipFromColumn(item, columnName);
            const tooltip = customTooltip
                || (typeof column.tooltip === 'function' ? column.tooltip(value) : column.tooltip);

            return (
                <TableCell
                    className={classNames(classes.tableCell, {
                        [classes.hideOnCompactView]: !!column.hideOnCompactView,
                    })}
                    style={{ width: column.fixedWidth }}
                    key={columnName as string}
                >
                    <Box display="flex" alignItems="center">
                        {column.icon && (
                            <Box flex="0 0 auto" paddingRight={0.5}>
                                <Typography color="primary" className={classes.cellIcon}>
                                    {column.icon}
                                </Typography>
                            </Box>
                        )}
                        <Box flex="1 1 auto">
                            {column.label && (
                                <Typography
                                    display="block"
                                    className={classes.label}
                                >
                                    {column.label}
                                </Typography>
                            )}
                            <Box display="flex" alignItems="center">
                                {column.noWrap ? (
                                    <TooltipDiv text={value} className={cellClassName} />
                                ) : (
                                    <Typography variant="body2" className={cellClassName}>
                                        {value}
                                    </Typography>
                                )}
                                {tooltip && (
                                    <Tooltip title={tooltip} iconSize="small" />
                                )}
                            </Box>
                        </Box>
                    </Box>
                </TableCell>
            );
        });
    }

    function renderPlaceholderCells() {
        return Object.keys(columns).map((untypedColumnName) => {
            const columnName = (untypedColumnName as unknown) as keyof ColumnNames;
            const column = columns[columnName] as IColumn<ColumnNames>;

            return (
                <TableCell
                    className={classNames(classes.tableCell, {
                        [classes.hideOnCompactView]: !!column.hideOnCompactView,
                    })}
                    style={{ width: column.fixedWidth }}
                    key={columnName as string}
                >
                    <Box display="flex" alignItems="center">
                        {renderPlaceholderCellContent()}
                    </Box>
                </TableCell>
            );
        });
    }

    function renderPlaceholderCellContent() {
        return (
            <Box
                className={classes.placeholderContent}
                flex="1 1 auto"
            />
        );
    }
}
