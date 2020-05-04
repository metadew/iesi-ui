import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
    IListItem,
    ListColumns,
    IColumn,
    IListAction,
    ISortedColumn,
    ListFilters,
} from 'models/list.models';
import { TableCell, Typography, IconButton, Theme, Box, Tooltip, Icon } from '@material-ui/core';
import { Info } from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';
import sortListItems from 'utils/list/sortListItems';
import { filterListItems } from 'utils/list/filters';
import { getListItemValueFromColumn } from 'utils/list/list';
import { TObjectWithProps } from 'models/core.models';

const SHORTEN_VALUE_FROM_CHARACTERS = 40;

interface IPublicProps<ColumnNames> {
    columns: ListColumns<ColumnNames>;
    listItems: IListItem<ColumnNames>[];
    listActions?: IListAction[];
    sortedColumn?: ISortedColumn<ColumnNames>;
    filters?: ListFilters<Partial<ColumnNames>>;
}

const useStyles = makeStyles(({ palette }: Theme) => ({
    table: {
        minWidth: 650,
        tableLayout: 'auto',
    },
    label: {
        fontSize: '.8rem',
        color: grey[500],
    },
    action: {
        width: 50,
    },
    actionIcon: {
        color: palette.primary.dark,
    },
}));

export default function GenericList<ColumnNames>({
    listItems,
    columns,
    listActions,
    sortedColumn,
    filters,
}: IPublicProps<ColumnNames>) {
    const classes = useStyles();

    const items = sortedColumn
        ? sortListItems(listItems, sortedColumn as ISortedColumn<{}>)
        : listItems;

    const filteredItems = filters
        ? filterListItems(items, filters as TObjectWithProps)
        : items;

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableBody>
                    {filteredItems.map((item: IListItem<ColumnNames>) => (
                        <TableRow key={item.id}>
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
                                            <Typography className={className}>
                                                {shortenedValue}
                                            </Typography>
                                            {tooltip && (
                                                <Box marginLeft={1}>
                                                    <Tooltip title={tooltip}>
                                                        <Icon aria-label="info">
                                                            <Info />
                                                        </Icon>
                                                    </Tooltip>
                                                </Box>
                                            )}
                                        </Box>
                                    </TableCell>
                                );
                            })}
                            {listActions.map((action, index) => (
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
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
