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
    ISortedColumn,
    ListFilters,
} from 'models/list.models';
import {
    TableCell,
    Typography,
} from '@material-ui/core';
import sortListItems from 'utils/list/sortListItems';
import { THEME_COLORS } from 'config/themes/colors';
import { filterListItems } from 'utils/list/filters';
import { TObjectWithProps } from 'models/core.models';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import GenericTableRow from '../GenericTableRow';

interface IPublicProps<ColumnNames> {
    columns: ListColumns<ColumnNames>;
    listItems: IListItem<ColumnNames>[];
    sortedColumn?: ISortedColumn<ColumnNames>;
    filters?: ListFilters<TObjectWithProps>;
    onChange: (selectedIds: ReactText[]) => void;
    selectedIds: ReactText[];
    setSelectedIds: (selectedIds: ReactText[]) => void;
}

const useStyles = makeStyles(({ spacing, shape, palette }) => ({
    table: {
        '& .MuiTableRow-root': {
            border: '1px solid',
            borderColor: palette.grey[300],
        },
        '& .MuiTableCell-root': {
            position: 'relative',
            padding: `${spacing(1.1)}px ${spacing(3)}px`,
            borderBottomWidth: 0,
            '&:after': {
                content: '" "',
                position: 'absolute',
                top: spacing(1.5),
                bottom: spacing(1.5),
                right: 0,
                width: '1px',
                backgroundColor: THEME_COLORS.GREY,
            },
            '&:first-child': {
                borderTopLeftRadius: shape.borderRadius,
                borderBottomLeftRadius: shape.borderRadius,
            },
            '&:last-child': {
                borderTopRightRadius: shape.borderRadius,
                borderBottomRightRadius: shape.borderRadius,
                '&:after': {
                    display: 'none',
                },
            },
        },
    },
    filteredOutButSelected: {
        opacity: 0.6,
    },
}));

export default function GenericSelectableList<ColumnNames>({
    listItems,
    columns,
    sortedColumn,
    filters,
    onChange,
    selectedIds,
    setSelectedIds,
}: IPublicProps<ColumnNames>) {
    const classes = useStyles();

    const items = sortedColumn
        ? sortListItems(listItems, sortedColumn as ISortedColumn<{}>)
        : listItems;

    const filteredItems = filters
        ? filterListItems(items, filters as TObjectWithProps)
        : items;

    return (
        <TableContainer elevation={0} component={Paper} className={classes.table}>
            <Table aria-label="selectable table">
                <TableBody>
                    {filteredItems.length === 0 && (
                        <TableRow>
                            <TableCell>
                                <Typography>
                                    <Translate msg="common.list.no_results" />
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                    {filteredItems.map((item: IListItem<ColumnNames>) => (
                        <GenericTableRow
                            key={item.id}
                            item={item}
                            columns={columns}
                            disableElevation
                            selectable={{
                                onSelect,
                                selected: selectedIds.includes(item.id),
                            }}
                        />
                    ))}
                    {getFilteredOutButSelectedItems().map((item: IListItem<ColumnNames>) => (
                        <GenericTableRow
                            className={classes.filteredOutButSelected}
                            key={item.id}
                            item={item}
                            columns={columns}
                            disableElevation
                            selectable={{
                                onSelect,
                                selected: selectedIds.includes(item.id),
                            }}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    function onSelect(id: ReactText) {
        const currentIndex = selectedIds.indexOf(id);
        const newSelectedIds = [...selectedIds];

        if (currentIndex === -1) {
            newSelectedIds.push(id);
        } else {
            newSelectedIds.splice(currentIndex, 1);
        }

        setSelectedIds(newSelectedIds);
        onChange(newSelectedIds);
    }

    function getFilteredOutButSelectedItems() {
        return items.filter((item) => {
            const selected = selectedIds.includes(item.id);
            if (!selected) {
                return false;
            }
            return !filteredItems.find((filteredItem) => filteredItem.id === item.id);
        });
    }
}
