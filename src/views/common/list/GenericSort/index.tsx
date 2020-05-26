import React from 'react';
import classnames from 'classnames';
import {
    Typography,
    Box,
    Button,
    ButtonGroup,
    Theme,
    makeStyles,
} from '@material-ui/core';
import { ISortedColumn, ISortAction, SortOrder, SortActions } from 'models/list.models';
import { TObjectWithProps } from 'models/core.models';
import ImportExport from '@material-ui/icons/ImportExport';
import Translate from '@snipsonian/react/es/components/i18n/Translate';

interface IPublicProps<ColumnNames> {
    sortActions: SortActions<ColumnNames>;
    onSort: (sortedColumn: ISortedColumn<ColumnNames>) => void;
    sortedColumn: ISortedColumn<TObjectWithProps>;
}

const useStyles = makeStyles(({ palette, spacing, typography }: Theme) => ({
    sort: {
        marginTop: spacing(1),
    },
    label: {
        fontWeight: typography.fontWeightBold,
        color: palette.primary.main,
    },
    buttonGroup: {
        marginLeft: spacing(2),
    },
    button: {
        fontWeight: typography.fontWeightBold,
        textTransform: 'none',
    },
    active: {
        color: palette.primary.main,
    },
}));

export default function GenericSort<ColumnNames>({
    sortActions,
    onSort,
    sortedColumn,
}: IPublicProps<ColumnNames>) {
    const classes = useStyles();

    return (
        <Box display="flex" alignItems="center" className={classes.sort} boxShadow={0}>
            <Typography className={classes.label}><Translate msg="common.list.sort.sort_by" /></Typography>
            <ButtonGroup
                variant="contained"
                aria-label="contained button group"
                className={classes.buttonGroup}
            >
                {Object.keys(sortActions).map((untypedColumnName) => {
                    const columnName = untypedColumnName as unknown as keyof ColumnNames;
                    const sortAction = sortActions[columnName] as ISortAction<ColumnNames>;
                    const isActive = !!sortedColumn && sortedColumn.name === columnName;

                    return (
                        <Button
                            key={untypedColumnName}
                            variant="contained"
                            className={classnames(classes.button, { [classes.active]: isActive })}
                            disableElevation
                            endIcon={<ImportExport />}
                            onClick={() => onSort({
                                name: columnName,
                                sortOrder: getSortOrder(columnName),
                                sortType: sortAction.sortType,
                            })}
                            size="small"
                        >
                            {sortAction.label}
                        </Button>
                    );
                })}
            </ButtonGroup>
        </Box>
    );

    function getSortOrder(columnName: keyof ColumnNames) {
        if (!sortedColumn) {
            return SortOrder.Ascending;
        }
        if (sortedColumn.name !== columnName) {
            return SortOrder.Ascending;
        }

        return sortedColumn.sortOrder === SortOrder.Ascending
            ? SortOrder.Descending : SortOrder.Ascending;
    }
}
