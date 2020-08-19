import React from 'react';
import classNames from 'classnames';
import { parseISO, format as formatDate } from 'date-fns/esm';
import {
    Box,
    makeStyles,
    Theme,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
    Typography,
    Button,
} from '@material-ui/core';
import {
    ExpandMore as ExpandMoreIcon,
    ErrorOutline as ErrorIcon,
    CheckOutlined as SuccessIcon,
    ReportProblemOutlined as WarningIcon,
    ChevronRightRounded,
} from '@material-ui/icons';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getTranslator } from 'state/i18n/selectors';
import {
    IListItem,
    ListColumns,
    IColumn,
} from 'models/list.models';
import { getListItemValueFromColumn } from 'utils/list/list';
import { THEME_COLORS } from 'config/themes/colors';
import { Alert, AlertTitle } from '@material-ui/lab';
import { IParameterRawValue, IOutputValue } from 'models/state/iesiGeneric.models';
import { observe, IObserveProps } from 'views/observe';
import { ExecutionActionStatus } from 'models/state/scriptExecutions.models';
import { StateChangeNotification } from 'models/state.models';
import { useParams } from 'react-router-dom';
import { redirectTo, ROUTE_KEYS } from 'views/routes';
import { IExecutionDetailPathParams } from './shared';

const ACTION_TYPE_NAME_WITH_CHILD_SCRIPTS = 'fwk.executeScript';

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
    statusCell: {},
    statusCellError: {
        color: THEME_COLORS.ERROR,
    },
    statusCellSuccess: {
        color: THEME_COLORS.SUCCESS,
    },
    statusCellWarning: {
        color: THEME_COLORS.WARNING,
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
    thCell: {
        wordBreak: 'normal',
        verticalAlign: 'top',
    },
}));

function ScriptExecutionDetailActions<ColumnNames>({
    listItems,
    columns,
    state,
}: IPublicProps<ColumnNames> & IObserveProps) {
    const classes = useStyles();
    const translator = getTranslator(state);
    const { executionRequestId } = useParams<IExecutionDetailPathParams>();

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
                                className={classNames(classes.tableCell, classes.index)}
                            >
                                {item.data?.processId}
                            </Box>
                            {renderDataCols(item)}
                            <Box
                                paddingX={0}
                                paddingY={1.1}
                                boxSizing="content-box"
                                flex="0 0 auto"
                                className={classNames(classes.statusCell, {
                                    [classes.statusCellSuccess]: item.data.status === ExecutionActionStatus.Success,
                                    [classes.statusCellError]: item.data.status === ExecutionActionStatus.Error,
                                    [classes.statusCellWarning]: item.data.status === ExecutionActionStatus.Warning,
                                })}
                            >
                                {item.data.status === ExecutionActionStatus.Success && (
                                    <SuccessIcon />
                                )}
                                {item.data.status === ExecutionActionStatus.Warning && (
                                    <WarningIcon />
                                )}
                                {item.data.status === ExecutionActionStatus.Error && (
                                    <ErrorIcon />
                                )}
                            </Box>
                        </Box>


                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.details}>
                        <Box
                            width="100%"
                            paddingY={1.1}
                        >
                            {renderDetailsContent(item)}
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
                        className={classNames(classes.tableCell, colClassName)}
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

    function renderDetailsContent(item: IListItem<ColumnNames>) {
        return (
            <>
                {item.data.error && (
                    <Alert severity="error" className={classes.error}>
                        <AlertTitle>
                            <Translate msg="script_reports.detail.main.action.error" />
                        </AlertTitle>
                    </Alert>
                )}

                <Box marginBottom={2}>
                    <Paper elevation={0}>
                        <Box paddingX={1} paddingY={1}>
                            <Box display="flex" alignItems="center">
                                <Box flex="1 1 auto">
                                    <Typography variant="subtitle2">Action Type</Typography>
                                    <Typography>{item.data.type}</Typography>
                                </Box>
                                {(item.data.type === ACTION_TYPE_NAME_WITH_CHILD_SCRIPTS) && (
                                    <Box flex="0 0 auto" paddingX={1}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            endIcon={<ChevronRightRounded />}
                                            onClick={() => redirectTo({
                                                routeKey: ROUTE_KEYS.R_REPORT_DETAIL,
                                                params: {
                                                    executionRequestId,
                                                    runId: item.data.runId,
                                                    processId: item.data.processId,
                                                },
                                            })}
                                        >
                                            <Translate msg="script_reports.detail.main.action.go_to_script_detail" />
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Paper>
                </Box>

                {item.data.inputParameters.length > 0 && (
                    <Box marginBottom={2}>
                        <TableContainer component={Paper} elevation={0}>
                            <Box paddingX={1} paddingY={1}>
                                <Typography variant="subtitle2">
                                    <Translate msg="script_reports.detail.main.action.input_parameters" />
                                </Typography>
                            </Box>
                            <Table
                                size="small"
                                aria-label={translator('script_reports.detail.main.action.input_parameters')}
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>&nbsp;</TableCell>
                                        <TableCell>Raw value</TableCell>
                                        <TableCell>Resolved value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {item.data.inputParameters.map((parameter: IParameterRawValue) => (
                                        <TableRow key={`${item.id}-${parameter.name}`}>
                                            <TableCell component="th" scope="row" className={classes.thCell}>
                                                {parameter.name}
                                            </TableCell>
                                            <TableCell>{parameter.rawValue}</TableCell>
                                            <TableCell>{parameter.resolvedValue}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {item.data.condition && (
                    <Box marginBottom={2}>
                        <Paper elevation={0}>
                            <Box paddingX={1} paddingY={1}>
                                <Typography variant="subtitle2">
                                    <Translate msg="script_reports.detail.main.action.condition" />
                                </Typography>
                                <Typography>
                                    {item.data.condition}
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                )}

                <Box marginBottom={2}>
                    <Paper elevation={0}>
                        <Box paddingX={1} paddingY={1}>
                            <Typography variant="subtitle2">
                                <Translate msg="script_reports.detail.main.action.error_expected" />
                            </Typography>
                            <Typography>
                                <Translate msg={`common.${item.data.errorExpected ? 'yes' : 'no'}`} />
                            </Typography>
                        </Box>
                    </Paper>
                </Box>

                <Box marginBottom={2}>
                    <Paper elevation={0}>
                        <Box paddingX={1} paddingY={1}>
                            <Typography variant="subtitle2">
                                <Translate msg="script_reports.detail.main.action.error_stop" />
                            </Typography>
                            <Typography>
                                <Translate msg={`common.${item.data.errorStop ? 'yes' : 'no'}`} />
                            </Typography>
                        </Box>
                    </Paper>
                </Box>

                <Box marginBottom={2}>
                    <Paper elevation={0}>
                        <Box paddingX={1} paddingY={1}>
                            <Typography variant="subtitle2">
                                <Translate msg="script_reports.detail.main.action.start_timestamp" />
                            </Typography>
                            <Typography>
                                {formatDate(
                                    parseISO(item.data.startTimestamp.toString()),
                                    'dd/MM/yyyy HH:mm:ss',
                                )}
                            </Typography>
                        </Box>
                    </Paper>
                </Box>

                <Box marginBottom={2}>
                    <Paper elevation={0}>
                        <Box paddingX={1} paddingY={1}>
                            <Typography variant="subtitle2">
                                <Translate msg="script_reports.detail.main.action.end_timestamp" />
                            </Typography>
                            <Typography>
                                {formatDate(
                                    parseISO(item.data.endTimestamp.toString()),
                                    'dd/MM/yyyy HH:mm:ss',
                                )}
                            </Typography>
                        </Box>
                    </Paper>
                </Box>

                {item.data.output.length > 0 && (
                    <Box marginBottom={2}>
                        <TableContainer component={Paper} elevation={0}>
                            <Box paddingX={1} paddingY={1}>
                                <Typography variant="subtitle2">
                                    <Translate msg="script_reports.detail.main.action.output.label" />
                                </Typography>
                            </Box>
                            <Table
                                size="small"
                                aria-label={translator('script_reports.detail.main.action.output.label')}
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Translate msg="script_reports.detail.main.action.output.name" />
                                        </TableCell>
                                        <TableCell>
                                            <Translate msg="script_reports.detail.main.action.output.value" />
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {item.data.output.map((output: IOutputValue) => (
                                        <TableRow key={`${item.id}-${output.name}`}>
                                            <TableCell component="th" scope="row" className={classes.thCell}>
                                                {output.name}
                                            </TableCell>
                                            <TableCell>{output.value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </>
        );
    }
}

export default observe<IPublicProps<{}>>(
    [StateChangeNotification.I18N_TRANSLATIONS],
    ScriptExecutionDetailActions,
);
