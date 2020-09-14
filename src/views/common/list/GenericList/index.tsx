import React, { useRef, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
    IListItem,
    ListColumns,
    IListAction,
    ISortedColumn,
    ListFilters,
} from 'models/list.models';
import {
    TableCell,
    Typography,
    Theme,
} from '@material-ui/core';
import {
    Pagination,
    PaginationItem,
} from '@material-ui/lab';
import sortListItems from 'utils/list/sortListItems';
import { filterListItems } from 'utils/list/filters';
import { TObjectWithProps } from 'models/core.models';
import AppTemplateContainer from 'views/appShell/AppTemplateContainer';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import isSet from '@snipsonian/core/es/is/isSet';
import { IPageData } from 'models/state/iesiGeneric.models';
import GenericTableRow from '../GenericTableRow';
import { useListStyles } from '../common';

const ROWS_PER_PAGE = 20;
const MAX_TABLE_WIDTH_FOR_COMPACT_VIEW = 800; // in px

interface IPublicProps<ColumnNames> {
    columns: ListColumns<ColumnNames>;
    listItems: IListItem<ColumnNames>[];
    listActions?: IListAction[];
    sortedColumn?: ISortedColumn<ColumnNames>;
    filters?: ListFilters<Partial<ColumnNames>>;
    isLoading?: boolean;
    pagination?: {
        pageData: IPageData;
        onChange: ({ page }: { page: number }) => void;
    };
}

const useStyles = makeStyles(({ palette }: Theme) => ({
    paginationSelected: {
        backgroundColor: `${palette.primary.main} !important`,
        color: palette.background.paper,
    },
}));

export default function GenericList<ColumnNames>({
    listItems,
    columns,
    listActions,
    sortedColumn,
    filters,
    isLoading,
    pagination,
}: IPublicProps<ColumnNames>) {
    const classes = useStyles();
    const listClasses = useListStyles();
    const ref = useRef<HTMLTableElement>();
    const [compactView, setCompactView] = useState(false);

    const items = sortedColumn
        ? sortListItems(listItems, sortedColumn as ISortedColumn<{}>)
        : listItems;

    const filteredItems = filters
        ? filterListItems(items, filters as TObjectWithProps)
        : items;

    const itemsToDisplay = filteredItems;

    useEffect(() => {
        const checkIfCompactView = () => {
            if (ref.current) {
                setCompactView(ref.current.offsetWidth <= MAX_TABLE_WIDTH_FOR_COMPACT_VIEW);
            }
        };

        const debouncedHandleResize = debounce(checkIfCompactView, 200);

        checkIfCompactView();
        window.addEventListener('resize', debouncedHandleResize);

        return () => {
            window.removeEventListener('resize', debouncedHandleResize);
        };
    }, []);

    return (
        <>
            <TableContainer elevation={0} component={Paper} className={listClasses.tableContainer}>
                <Table className={listClasses.table} aria-label="simple table" ref={ref}>
                    <TableBody>
                        {isLoading ? (
                            [...Array(ROWS_PER_PAGE)].map((placeholder, key) => (
                                <GenericTableRow
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={`${key}-placeholder`}
                                    index={key}
                                    listActions={listActions}
                                    columns={columns}
                                    compactView={compactView}
                                />
                            ))
                        ) : (
                            <>
                                {itemsToDisplay.length === 0 && (
                                    <TableRow>
                                        <TableCell>
                                            <Typography>
                                                <Translate msg="common.list.no_results" />
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {itemsToDisplay.map((item: IListItem<ColumnNames>, index) => (
                                    <GenericTableRow
                                        index={index}
                                        key={item.id}
                                        item={item}
                                        listActions={listActions}
                                        columns={columns}
                                        compactView={compactView}
                                    />
                                ))}
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {(isSet(pagination) && isSet(pagination.pageData) && !isLoading) && (
                <AppTemplateContainer>
                    <Pagination
                        count={pagination.pageData.totalPages}
                        shape="rounded"
                        onChange={handleChangePage}
                        page={pagination.pageData.number}
                        showFirstButton
                        showLastButton
                        renderItem={(props) => (
                            <PaginationItem
                                {...props}
                                classes={{ selected: classes.paginationSelected }}
                            />
                        )}
                    />
                </AppTemplateContainer>
            )}
        </>
    );

    function handleChangePage(event: React.ChangeEvent<unknown> | null, newPage: number) {
        pagination.onChange({ page: newPage });
    }
}
