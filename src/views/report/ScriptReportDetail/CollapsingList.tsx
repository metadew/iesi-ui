import React from 'react';
import {
    // Box,
    Typography,
    makeStyles,
    Theme,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
    IListItem,
    ListColumns,
    IColumn,
} from 'models/list.models';
import { formatNumberWithTwoDigits } from 'utils/number/format';
import { getListItemValueFromColumn } from 'utils/list/list';

interface IPublicProps<ColumnNames> {
    listItems: IListItem<ColumnNames>[];
    columns: ListColumns<ColumnNames>;
}

const useStyles = makeStyles(({ typography }: Theme) => ({
    index: {
        width: 50,
        flexGrow: 0,
        fontWeight: typography.fontWeightBold,
        textAlign: 'center',
    },
}));

export default function CollapsingList<ColumnNames>({
    listItems,
    columns,
}: IPublicProps<ColumnNames>) {
    const classes = useStyles();
    console.log(listItems);

    return (
        <>
            { listItems.map((item: IListItem<ColumnNames>, index: number) => (
                <ExpansionPanel key={item.id as string}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography className={classes.index}>
                            {formatNumberWithTwoDigits(index + 1)}
                        </Typography>
                        {renderDataCols(item)}

                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                            sit amet blandit leo lobortis eget.
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            ))}
        </>
    );

    function renderDataCols(item: IListItem<ColumnNames>) {
        return Object.keys(columns).map((untypedColumnName) => {
            const columnName = (untypedColumnName as unknown) as keyof ColumnNames;
            const column = columns[columnName] as IColumn<ColumnNames>;

            const value = getListItemValueFromColumn(item, columnName).toString();

            const colClassName = typeof column.className === 'function'
                ? column.className(value)
                : column.className;

            return (
                <Typography key={columnName as string} className={colClassName}>
                    {value}
                </Typography>
            );
        });
    }
}
