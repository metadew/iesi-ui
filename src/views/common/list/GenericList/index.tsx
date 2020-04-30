import React, { ReactText } from 'react';
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
    IListItemValueWithSortValue,
} from 'models/list.models';
import { TableCell, Typography, IconButton, Theme } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import sortListItems from 'utils/list/sortListItems';
import isObject from '@snipsonian/core/es/is/isObject';

interface IPublicProps<ColumnNames> {
    columns: ListColumns<ColumnNames>;
    listItems: IListItem<ColumnNames>[];
    listActions?: IListAction[];
    sortedColumn?: ISortedColumn<ColumnNames>;
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
}: IPublicProps<ColumnNames>) {
    const classes = useStyles();

    const items = sortedColumn
        ? sortListItems(listItems, sortedColumn as ISortedColumn<{}>)
        : listItems;

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableBody>
                    {items.map((item: IListItem<ColumnNames>) => (
                        <TableRow key={item.id}>
                            {Object.keys(columns).map((untypedColumnName) => {
                                const columnName = (untypedColumnName as unknown) as keyof ColumnNames;
                                const column = columns[columnName] as IColumn<ColumnNames>;

                                let value: ReactText = '';
                                if (isObject(item.columns[columnName])) {
                                    const columnData = item.columns[columnName] as IListItemValueWithSortValue;
                                    value = columnData.value;
                                } else {
                                    value = item.columns[columnName] as ReactText;
                                }

                                const className = typeof column.className === 'function'
                                    ? column.className(value)
                                    : column.className;

                                return (
                                    <TableCell key={columnName as string}>
                                        <Typography
                                            display="block"
                                            className={classes.label}
                                        >
                                            {column.label}
                                        </Typography>
                                        <Typography className={className}>
                                            {value}
                                        </Typography>
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
