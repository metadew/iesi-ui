import React from 'react';
import classNames from 'classnames';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
    IListItem,
    ListColumns,
    IListAction,
} from 'models/list.models';
import {
    TableCell,
    Typography,
} from '@material-ui/core';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import GenericTableRow from '../GenericTableRow';
import { useListStyles } from '../common';

interface IPublicProps<ColumnNames> {
    columns: ListColumns<ColumnNames>;
    listItems: IListItem<ColumnNames>[];
    listActions?: IListAction[];
    onOrder: (newListItems: IListItem<ColumnNames>[]) => void;
}

export default function GenericDraggableList<ColumnNames>({
    listItems,
    columns,
    listActions,
    onOrder,
}: IPublicProps<ColumnNames>) {
    const listClasses = useListStyles();

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(droppableProvided, droppableSnapshot) => (
                    <TableContainer
                        ref={droppableProvided.innerRef}
                        elevation={0}
                        component={Paper}
                        className={classNames(listClasses.tableContainer, {
                            [listClasses.tableContainerIsDragging]: !!droppableSnapshot.draggingFromThisWith,
                        })}
                    >
                        <Table className={listClasses.table} aria-label="draggable table">
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
                                {listItems.map((item: IListItem<ColumnNames>, index: number) => (
                                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                        {(draggableProvided, draggableSnapshot) => (
                                            <GenericTableRow
                                                draggableProps={{
                                                    ref: draggableProvided.innerRef,
                                                    ...draggableProvided.draggableProps,
                                                    ...draggableProvided.dragHandleProps,
                                                }}
                                                key={item.id}
                                                item={item}
                                                listActions={listActions}
                                                columns={columns}
                                                indexToShow={index}
                                                isDragging={draggableSnapshot.isDragging}
                                            />
                                        )}
                                    </Draggable>
                                ))}
                                {droppableProvided.placeholder}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Droppable>
        </DragDropContext>
    );

    function onDragEnd(result: DropResult) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            listItems,
            result.source.index,
            result.destination.index,
        );

        onOrder(items);
    }

    function reorder(list: IListItem<ColumnNames>[], startIndex: number, endIndex: number) {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }
}