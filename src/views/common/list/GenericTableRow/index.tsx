import React from 'react';
import { getListItemValueFromColumn } from 'utils/list/list';
import {
    TableCell,
    Typography,
    IconButton,
    Theme,
    Box,
    makeStyles,
    TableRow,
} from '@material-ui/core';
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
    item: IListItem<ColumnNames>;
    columns: ListColumns<ColumnNames>;
    listActions?: IListAction[];
    draggableProps?: DraggableProvidedDraggableProps & DraggableProvidedDragHandleProps & {
        ref(element?: HTMLElement | null): unknown;
    };
    indexToShow?: number;
}

const useStyles = makeStyles(({ palette, shape, typography }: Theme) => ({
    tableRow: {
        background: palette.background.paper,
        boxShadow: '0 2px 22px rgba(0, 0, 0, .10)',
        borderRadius: shape.borderRadius,
    },
    label: {
        fontSize: '.8rem',
        color: palette.grey[500],
    },
    action: {
        width: 50,
    },
    actionIcon: {
        color: palette.primary.dark,
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
    indexToShow,
}: IPublicProps<ColumnNames>) {
    const classes = useStyles();
    return (
        <TableRow className={classes.tableRow} {...draggableProps}>
            {isSet(draggableProps) && (
                <TableCell className="drag-handle">
                    <DragHandlerIcon fontSize="inherit" />
                </TableCell>
            )}
            {isSet(indexToShow) && (
                <TableCell>
                    <Typography className={classes.index}>{formatNumberWithTwoDigits(indexToShow)}</Typography>
                </TableCell>
            )}
            {Object.keys(columns).map((untypedColumnName) => {
                const columnName = (untypedColumnName as unknown) as keyof ColumnNames;
                const column = columns[columnName] as IColumn<ColumnNames>;

                const value = getListItemValueFromColumn(item, columnName).toString();
                const shortenedValue = value.length > SHORTEN_VALUE_FROM_CHARACTERS
                    ? `${value.substr(0, SHORTEN_VALUE_FROM_CHARACTERS)}...`
                    : value;

                const className = typeof column.className === 'function'
                    ? column.className(value)
                    : column.className;

                const tooltip = typeof column.tooltip === 'function'
                    ? column.tooltip(value)
                    : column.tooltip;

                return (
                    <TableCell style={{ width: column.fixedWidth }} key={columnName as string}>
                        <Typography
                            display="block"
                            className={classes.label}
                        >
                            {column.label}
                        </Typography>
                        <Box display="flex" alignItems="center">
                            <Typography variant="body2" className={className}>
                                {shortenedValue}
                                {tooltip && (
                                    <Tooltip title={tooltip} iconSize="small" />
                                )}
                            </Typography>
                        </Box>
                    </TableCell>
                );
            })}
            {listActions && listActions.map((action, index) => (
                <TableCell // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    align="right"
                    className={classes.action}
                >
                    <IconButton
                        onClick={() => action.onClick(item.id)}
                        className={classes.actionIcon}
                    >
                        {action.icon}
                    </IconButton>
                </TableCell>
            ))}
        </TableRow>
    );
}
