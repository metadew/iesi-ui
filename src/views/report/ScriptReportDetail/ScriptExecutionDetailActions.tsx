import React, { Fragment } from 'react';
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
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import DescriptionList from 'views/common/list/DescriptionList';
import {
    IListItem,
    ListColumns,
    IColumn,
} from 'models/list.models';
import { getListItemValueFromColumn } from 'utils/list/list';
import { THEME_COLORS } from 'config/themes/colors';
import { Alert, AlertTitle } from '@material-ui/lab';
import { IParameterRawValue } from 'models/state/iesiGeneric.models';
// import { IDummyScriptActionParameter } from 'models/state/scripts.models';

interface IPublicProps<ColumnNames> {
    listItems: IListItem<ColumnNames>[];
    columns: ListColumns<ColumnNames>;
}

const useStyles = makeStyles(({ typography, palette, shape, spacing }: Theme) => ({
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
        boxShadow: '0 2px 22px rgba(0, 0, 0, .10)',
        borderRadius: shape.borderRadius,
        border: 'none',
        overflow: 'hidden',
    },
    childExpandableItem: {
        overflow: 'hidden',
        boxShadow: 'none',
        border: `1px solid ${THEME_COLORS.GREY_LIGHT}`,
        '&:first-child': {
            borderTopLeftRadius: shape.borderRadius,
        },
    },
    childExpandableItemSummery: {
        padding: '0 0 0 20px',
        margin: 0,
    },
    errorCell: {
        color: THEME_COLORS.ERROR,
    },
    details: {
        background: palette.background.default,
    },
    error: {
        marginBottom: `${spacing(2)}px`,
    },
    detailList: {
        width: '40%',
    },
    detailParameterLabel: {
        fontSize: typography.pxToRem(12),
        color: palette.grey[500],
    },
    descriptionListHolder: {
        margin: 0,

        '& > dl': {
            margin: 0,
        },
    },
}));

export default function ScriptExecutionDetailActions<ColumnNames>({
    listItems,
    columns,
}: IPublicProps<ColumnNames>) {
    const classes = useStyles();

    return (
        <>
            { listItems.map((item: IListItem<ColumnNames>) => (
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
                                {item.data?.processId}
                            </Box>
                            {renderDataCols(item)}
                            {item.data.error && (
                                <Box
                                    paddingX={0}
                                    paddingY={1.1}
                                    boxSizing="content-box"
                                    flex="0 0 auto"
                                    className={classes.errorCell}
                                >
                                    <ErrorOutlineIcon />
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
                        key={`${item.id}-${columnName as string}`}
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
                    key={`${item.id}-${columnName as string}`}
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

                {/* { item.data.inputParameters.map((parameter: IParameterRawValue, index: number) => ( */}
                <ExpansionPanel key={`${item.id}-inputParameters`} className={classes.childExpandableItem}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        className={classes.childExpandableItemSummery}
                    >
                        <Box
                            paddingX={0}
                            paddingY={2}
                        >
                            <Typography className={classes.detailParameterLabel}>
                                <Translate msg="script_reports.detail.main.action.input_parameters" />
                            </Typography>
                            <Typography>
                                {item.data.inputParameters.map((parameter: IParameterRawValue, index: number) => (
                                    <Fragment key={`${item.id}-${parameter.name}`}>
                                        {index > 0 && ', '}
                                        {parameter.name}
                                    </Fragment>
                                ))}
                            </Typography>
                        </Box>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Box
                            paddingX={0}
                            paddingY={0}
                            display="flex"
                            flexDirection="column"
                            flex="0 1 40%"
                            className={classes.descriptionListHolder}
                        >
                            {item.data.inputParameters.map((parameter: IParameterRawValue) => (
                                <DescriptionList
                                    key={`${item.id}-${parameter.name}-list`}
                                    noLineAfterListItem
                                    items={[
                                        { label: 'name', value: parameter.name },
                                        { label: 'raw value', value: parameter.rawValue },
                                        { label: 'resolved value', value: parameter.resolvedValue },
                                    ]}
                                />
                            ))}
                        </Box>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </>

        );
    }
}
