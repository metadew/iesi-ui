import React, { useState, ReactText } from 'react';
import { Box, makeStyles, IconButton, Typography, Input, Button } from '@material-ui/core';
import { Search, Close } from '@material-ui/icons';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { observe, IObserveProps } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { getTranslator } from 'state/i18n/selectors';
import GenericSelectableList from 'views/common/list/GenericSelectableList';
import { FilterType, SortOrder, SortType } from 'models/list.models';
import { IDummyScriptAction } from 'models/state/scripts.models';

interface IPublicProps {
    onClose: () => void;
    onAdd: (actions: IDummyScriptAction[]) => void;
}

const useStyles = makeStyles(({ palette, spacing, typography }) => ({
    dialog: {
        background: palette.background.default,
    },
    header: {
        background: palette.background.paper,
    },
    headerAction: {
        margin: '2px 0',
    },
    search: {
        flex: '1 1 auto',
        margin: spacing(1),
    },
    scriptName: {
        fontWeight: typography.fontWeightBold,
        color: palette.primary.main,
    },
    scriptDescription: {
        fontWeight: typography.fontWeightBold,
        fontSize: typography.pxToRem(12),
    },
}));

const MOCKED_LIST_ITEMS = [{
    id: 1232321,
    columns: {
        name: 'Action One',
        description: 'Set a parameter as runtime variable',
    },
}, {
    id: 2123123,
    columns: {
        name: 'Action Two',
        description: 'Set a parameter as runtime variable',
    },
}, {
    id: 3123123,
    columns: {
        name: 'Action Three',
        description: 'Set a parameter as runtime variable',
    },
}, {
    id: 4124124,
    columns: {
        name: 'Action Four',
        description: 'Set a parameter as runtime variable',
    },
}];

function AddAction({
    state,
    onClose,
    onAdd,
}: IObserveProps & IPublicProps) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchFilter, setSearchFilter] = useState('');
    const classes = useStyles();

    const translator = getTranslator(state);

    return (
        <Box className={classes.dialog}>
            <Box
                className={classes.header}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding={1}
            >
                <IconButton className={classes.headerAction} onClick={() => setIsSearchActive(!isSearchActive)}>
                    <Search />
                </IconButton>
                {isSearchActive ? (
                    <Input
                        autoFocus
                        type="text"
                        value={searchFilter}
                        placeholder={translator('common.list.filter.search')}
                        className={classes.search}
                        onChange={(e) => {
                            setSearchFilter(e.target.value);
                        }}
                    />
                ) : (
                    <Typography variant="h3">
                        <Translate msg="scripts.detail.main.add_action.header" />
                    </Typography>
                )}
                <IconButton className={classes.headerAction} onClick={onClose}>
                    <Close />
                </IconButton>
            </Box>
            <Box padding={2}>
                <GenericSelectableList
                    onChange={onSelectionChange}
                    columns={{
                        name: {
                            fixedWidth: '25%',
                            className: classes.scriptName,
                        },
                        description: {
                            fixedWidth: '75%',
                            className: classes.scriptDescription,
                        },
                    }}
                    filters={{
                        name: {
                            filterType: FilterType.Search,
                            values: [searchFilter],
                            name: 'name',
                        },
                    }}
                    sortedColumn={{
                        name: 'name',
                        sortOrder: SortOrder.Descending,
                        sortType: SortType.String,
                    }}
                    listItems={MOCKED_LIST_ITEMS}
                />
                <Box marginTop={3} textAlign="right">
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={onAddItems}
                        disabled={selectedIds.length <= 0}
                    >
                        <Translate
                            msg="scripts.detail.add_action.add_button"
                            placeholders={{ amount: selectedIds.length }}
                        />
                    </Button>
                </Box>
            </Box>
        </Box>
    );

    function onSelectionChange(ids: ReactText[]) {
        setSelectedIds(ids);
    }

    function onAddItems() {
        const actionsToAdd = MOCKED_LIST_ITEMS
            .filter((item) => selectedIds.includes(item.id))
            .map((item) => ({
                id: item.id,
                name: item.columns.name,
                description: item.columns.description,
            }));
        onAdd(actionsToAdd);
    }
}

export default observe<IPublicProps>([StateChangeNotification.I18N_TRANSLATIONS], AddAction);
