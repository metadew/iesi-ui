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
import {
    TableCell,
    Typography,
    IconButton,
    Theme,
    Box,
    Tooltip,
    Icon,
    TableFooter,
    TablePagination,
} from '@material-ui/core';
import {
    Info,
} from '@material-ui/icons';
import sortListItems from 'utils/list/sortListItems';
import { filterListItems } from 'utils/list/filters';
import { getListItemValueFromColumn } from 'utils/list/list';
import { TObjectWithProps } from 'models/core.models';
import TablePaginationActions from './TablePaginationActions';

const SHORTEN_VALUE_FROM_CHARACTERS = 40;

interface IPublicProps<ColumnNames> {
    columns: ListColumns<ColumnNames>;
    listItems: IListItem<ColumnNames>[];
    listActions?: IListAction[];
    sortedColumn?: ISortedColumn<ColumnNames>;
    filters?: ListFilters<Partial<ColumnNames>>;
    enablePagination?: boolean;
}

const useStyles = makeStyles(({ palette, spacing, shape }: Theme) => ({
    table: {
        padding: '22px', // For box shadows of tableRows
        minWidth: 650,
        tableLayout: 'auto',
        borderCollapse: 'separate',
        borderSpacing: `0 ${spacing(1)}px`,
        background: palette.background.default,
        '& .MuiTableCell-root': {
            borderBottomWidth: 0,
            '&:first-child': {
                borderTopLeftRadius: shape.borderRadius,
                borderBottomLeftRadius: shape.borderRadius,
            },
            '&:last-child': {
                borderTopRightRadius: shape.borderRadius,
                borderBottomRightRadius: shape.borderRadius,
            },
        },
    },
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
    tablePagination: {
        border: 'none',
    },
    tablePaginationSpacer: {
        display: 'none',
    },
}));

export default function GenericList<ColumnNames>({
    listItems,
    columns,
    listActions,
    sortedColumn,
    filters,
    enablePagination,
}: IPublicProps<ColumnNames>) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const classes = useStyles();

    const items = sortedColumn
        ? sortListItems(listItems, sortedColumn as ISortedColumn<{}>)
        : listItems;

    const filteredItems = filters
        ? filterListItems(items, filters as TObjectWithProps)
        : items;

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const itemsToDisplay = enablePagination && rowsPerPage > 0
        ? filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : filteredItems;

    return (
        <TableContainer elevation={0} component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableBody>
                    {itemsToDisplay.map((item: IListItem<ColumnNames>) => (
                        <TableRow className={classes.tableRow} key={item.id}>
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
                {enablePagination && (
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                className={classes.tablePagination}
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                count={filteredItems.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                classes={{ spacer: classes.tablePaginationSpacer }}
                                SelectProps={{
                                    inputProps: { 'aria-label': 'rows per page' },
                                    native: true,
                                }}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </TableContainer>
    );
}
