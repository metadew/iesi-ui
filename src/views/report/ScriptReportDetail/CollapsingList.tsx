import React from 'react';
import classnames from 'classnames';
import {
    Box,
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
import DescriptionList from 'views/common/list/DescriptionList';
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

const useStyles = makeStyles(({ typography, palette, spacing }: Theme) => ({
    index: {
        width: 50,
        flexGrow: 0,
        fontWeight: typography.fontWeightBold,
        textAlign: 'center',
        paddingLeft: 0,
        paddingRight: 1,
    },
    tableCell: {
        position: 'relative',
        '&:after': {
            content: '" "',
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: '1px',
            backgroundColor: THEME_COLORS.GREY,
        },
    },
    summary: {
        background: palette.background.paper,
        padding: 0,
        margin: 0,
    },
    expandableItem: {
        margin: '10px 0',
    },
    errorIcon: {
        fill: THEME_COLORS.ERROR,
    },
    details: {
        background: THEME_COLORS.GREY_LIGHTER,
    },
    error: {
        marginBottom: `${spacing(2)}px`,
    },
    detailList: {
        width: '40%',
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
                <ExpansionPanel key={item.id as string} className={classes.expandableItem}>
                    <ExpansionPanelSummary
                        className={classes.summary}
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                            padding={1}
                        >
                            <Box
                                paddingY={1.1}
                                boxSizing="content-box"
                                width={50}
                                className={classnames(classes.tableCell, classes.index)}
                            >
                                {formatNumberWithTwoDigits(index + 1)}
                            </Box>
                            {renderDataCols(item)}

                            {item.data.error && (
                                <Box
                                    paddingX={0}
                                    paddingY={1.1}
                                    boxSizing="content-box"
                                    flex="0 0 auto"
                                >
                                    <ErrorOutlineIcon className={classes.errorIcon} />
                                </Box>
                            )}
                        </Box>


                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.details}>
                        <Box
                            width="100%"
                            paddingY={1.1}
                        >
                            {renderCollapsibleContent(item)}
                        </Box>
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

            if (column.fixedWidth) {
                return (
                    <Box
                        key={columnName as string}
                        paddingX={3}
                        paddingY={1.1}
                        style={{ width: column.fixedWidth }}
                        className={classnames(classes.tableCell, colClassName)}
                    >
                        {value}
                    </Box>
                );
            }

            return (
                <Box
                    key={columnName as string}
                    paddingX={3}
                    paddingY={1.1}
                    flex="1 1 auto"
                    className={colClassName}
                >
                    {value}
                </Box>
            );
        });
    }

    function renderCollapsibleContent(item: IListItem<ColumnNames>) {
        return (
            <>
                {item.data.error && (
                    <Alert severity="error" className={classes.error}>
                        <AlertTitle>Error</AlertTitle>
                        {item.data.error}
                    </Alert>
                )}

                { item.data.parameters.map((parameter: IDummyScriptActionParameter, index: number) => {
                    console.log(parameter, index);

                    return (
                        <ExpansionPanel>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <Typography>
                                    Parameter
                                    {' '}
                                    {index}
                                </Typography>
                                <Typography>{parameter.description}</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Box mt={1} display="flex" flexDirection="column" flex="0 1 40%">
                                    <DescriptionList
                                        items={[
                                            { label: 'Value 1', value: parameter.values[0] },
                                            { label: 'Value 2', value: parameter.values[1] },
                                        ]}
                                    />
                                </Box>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    );
                })}
            </>

        );
    }
}
