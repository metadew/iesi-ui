import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
    TableCell,
    Typography,
} from '@material-ui/core';
import {
    IListItem,
    ListColumns,
    IListAction,
} from 'models/list.models';
import { useListStyles } from '../common';
import GenericTableRow from '../GenericTableRow';


interface IPublicProps<ColumnNames> {
    columns: ListColumns<ColumnNames>;
    listItems: IListItem<ColumnNames>[];
    listActions?: IListAction[];
}

export default function GenericCollapsingList<ColumnNames>({
    listItems,
    columns,
    listActions,
}: IPublicProps<ColumnNames>) {
    const listClasses = useListStyles();
    console.log(listItems, columns);

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            className={listClasses.tableContainer}
        >
            <Table className={listClasses.table}>
                <TableBody>
                    {listItems.length === 0 && (
                        <TableRow>
                            <TableCell>
                                <Typography>
                                    <Translate msg="common.list.no_results" />
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                    {listItems.map((item: IListItem<ColumnNames>, index: number) => {
                        console.log(item, index);

                        return (
                            <GenericTableRow
                                key={item.id}
                                item={item}
                                columns={columns}
                                showIndex
                                index={index + 1}
                                listActions={listActions}
                            />
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
