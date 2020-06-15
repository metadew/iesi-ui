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
import {
    ExpandMore as ExpandMoreIcon,
    ErrorOutline as ErrorOutlineIcon,
} from '@material-ui/icons';
import {
    IListItem,
    ListColumns,
    IColumn,
} from 'models/list.models';
import { formatNumberWithTwoDigits } from 'utils/number/format';
import { getListItemValueFromColumn } from 'utils/list/list';
import { THEME_COLORS } from 'config/themes/colors';
import { Alert, AlertTitle } from '@material-ui/lab';
import { IDummyScriptActionParameter } from 'models/state/scripts.models';

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
    errorIcon: {
        fill: THEME_COLORS.ERROR,
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

                        {item.data.error && (
                            <ErrorOutlineIcon className={classes.errorIcon} />
                        )}

                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        {renderCollapsibleContent(item)}
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

    function renderCollapsibleContent(item: IListItem<ColumnNames>) {
        return (
            <>
                {item.data.error && (
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {item.data.error}
                    </Alert>
                )}

                { item.data.parameters.map((parameter: IDummyScriptActionParameter, index: number) => {
                    console.log(parameter, index);

                    return (
                        <ExpansionPanel>
                            <ExpansionPanelSummary>
                                <Typography>
                                    Parameter
                                    {' '}
                                    {index}
                                </Typography>
                                <Typography>{parameter.description}</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Typography>
                                    Value 1
                                </Typography>
                                <Typography>
                                    {parameter.values[0]}
                                </Typography>
                                <Typography>
                                    Value 2
                                </Typography>
                                <Typography>
                                    {parameter.values[1]}
                                </Typography>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    );
                })}
            </>

        );
    }
}
