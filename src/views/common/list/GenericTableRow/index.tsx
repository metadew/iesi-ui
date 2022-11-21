import React, { ReactText, useEffect, useState } from 'react';
import { THEME_COLORS } from 'config/themes/colors';
import classNames from 'classnames';
import { getListItemTooltipFromColumn, getListItemValueFromColumn } from 'utils/list/list';
import {
    Box,
    Checkbox,
    darken,
    IconButton,
    ListItemIcon,
    makeStyles,
    Menu,
    MenuItem,
    TableCell,
    TableRow,
    Theme,
    Typography,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { IColumn, IListAction, IListItem, ListColumns } from 'models/list.models';
import { DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { formatNumberWithTwoDigits } from 'utils/number/format';
import isSet from '@snipsonian/core/es/is/isSet';
import Tooltip from 'views/common/tooltips/Tooltip';
import InfoTooltip from 'views/common/tooltips/InfoTooltip';
import DragHandlerIcon from 'views/common/icons/DragHandler';
import TooltipDiv from 'views/common/TooltipDiv';

interface IPublicProps<ColumnNames> {
    index: number;
    item?: IListItem<ColumnNames>;
    columns: ListColumns<ColumnNames>;
    listActions?: IListAction<ColumnNames>[];
    draggableProps?: DraggableProvidedDraggableProps & DraggableProvidedDragHandleProps & {
        ref(element?: HTMLElement | null): unknown;
    };
    showIndex?: boolean;
    isDragging?: boolean;
    compactView?: boolean;
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
    isHandled?: boolean;
}

const useStyles = makeStyles(({ palette, shape, typography, spacing }: Theme) => ({
    tableRow: (props: { isHandled: boolean }) => ({
        background: props.isHandled ? THEME_COLORS.GREY_LIGHT : palette.background.paper,
        height: '100%',
    }),
    tableRowElevated: {
        boxShadow: '0 2px 22px rgba(0, 0, 0, .10)',
        borderRadius: shape.borderRadius,
    },
    tableRowIsDragging: {
        borderSpacing: 0,
    },
    tableRowCompactView: {},
    tableCell: {
        height: '100%',
    },
    hideOnCompactView: {
        '.compact > &': {
            display: 'none',
        },
    },
    label: {
        fontSize: typography.pxToRem(12),
        color: palette.grey[500],
        whiteSpace: 'nowrap',
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
        '.compact > &': {
            display: 'none',
        },
    },
    actionsCellCompact: {
        display: 'none',
        '.compact > &': {
            display: 'table-cell',
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
    compactView,
    disableElevation,
    selectable,
    className,
    index: rowIndex,
    placeholderProps,
    isHandled,
}: IPublicProps<ColumnNames>) {
    const classes = useStyles({ isHandled });
    const [anchorEl, setAnchorEl] = useState(null);
    const [compactViewActive, setCompactViewActive] = useState(compactView);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const isPlaceholder = placeholderProps || typeof item === 'undefined';

    useEffect(() => {
        setCompactViewActive(!!compactView);
    }, [compactView]);

    return (
        <TableRow
            className={classNames(classes.tableRow, className, {
                [classes.tableRowElevated]: !disableElevation,
                [classes.tableRowIsDragging]: !!isDragging,
                compact: !!compactViewActive,
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
                    ) : renderPlaceholderCellContent(rowIndex + 1)}
                </TableCell>
            )}
            { isPlaceholder ? renderPlaceholderCells() : renderDataCells()}
            {listActions && !isPlaceholder && (
                <>
                    <TableCell
                        align="right"
                        className={classNames(classes.tableCell, classes.actionsCell, {
                            [classes.hideOnCompactView]: listActions.length > 1,
                        })}
                    >
                        <div className={classes.actionsWrapper}>
                            {listActions.map((action, listActionIndex) => {
                                let icon;
                                if (typeof action.icon === 'function') {
                                    icon = action.icon(item.id, rowIndex);
                                } else {
                                    icon = action.icon;
                                }

                                return (
                                    !isPlaceholder ? (
                                        (!action.hideAction || !action.hideAction(item, rowIndex)) && (
                                            // eslint-disable-next-line react/no-array-index-key
                                            <div key={listActionIndex} className={classes.actionsItem}>

                                                <Tooltip title={action.label} enterDelay={1000} enterNextDelay={1000}>
                                                    <IconButton
                                                        area-label={action.label}
                                                        onClick={() => action.onClick(item.id, rowIndex)}
                                                        className={classes.actionIcon}
                                                    >
                                                        {icon}
                                                    </IconButton>
                                                </Tooltip>

                                            </div>
                                        )
                                    ) : renderPlaceholderCellContent(listActionIndex)
                                );
                            })}
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
                            ) : renderPlaceholderCellContent(rowIndex + 1)}
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
                                {listActions.map((action, listActionIndex) => {
                                    let icon;
                                    if (typeof action.icon === 'function') {
                                        icon = action.icon(item.id, rowIndex);
                                    } else {
                                        icon = action.icon;
                                    }
                                    return (
                                        // eslint-disable-next-line max-len
                                        !isPlaceholder && (!action.hideAction || !action.hideAction(item, rowIndex)) && (
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
                                                    {icon}
                                                </ListItemIcon>
                                                <Typography variant="inherit" noWrap>{action.label}</Typography>
                                            </MenuItem>
                                        )
                                    );
                                })}
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
                <>
                    {!column.hide
                    && (
                        <TableCell
                            className={classNames(classes.tableCell, {
                                [classes.hideOnCompactView]: !!column.hideOnCompactView || !!column.hide,

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
                                            <InfoTooltip title={tooltip} iconSize="small" />
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </TableCell>
                    )}
                </>
            );
        });
    }

    function renderPlaceholderCells() {
        return Object.keys(columns).map((untypedColumnName, index) => {
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
                        {renderPlaceholderCellContent(index)}
                    </Box>
                </TableCell>
            );
        });
    }

    function renderPlaceholderCellContent(key: number) {
        return (
            <Box
                key={key}
                className={classes.placeholderContent}
                flex="1 1 auto"
            />
        );
    }
}
