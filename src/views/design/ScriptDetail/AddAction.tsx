import React, { useState, ReactText, ChangeEvent } from 'react';
import classnames from 'classnames';
import {
    Box,
    makeStyles,
    IconButton,
    Typography,
    Input,
    Button,
    ButtonGroup,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core';
import { Search, Close } from '@material-ui/icons';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { observe, IObserveProps } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { getTranslator } from 'state/i18n/selectors';
import GenericSelectableList from 'views/common/list/GenericSelectableList';
import { FilterType, SortOrder, SortType, IListItem } from 'models/list.models';
import { getAsyncActionTypes } from 'state/entities/constants/selectors';
import { IActionType } from 'models/state/constants.models';
import { IScriptAction } from 'models/state/scripts.models';
import Tooltip from 'views/common/tooltips/Tooltip';

interface IPublicProps {
    onClose: () => void;
    onAdd: (actions: IScriptAction[]) => void;
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
    actionType: {
        fontWeight: typography.fontWeightBold,
        color: palette.primary.main,
    },
    actionName: {
        fontWeight: typography.fontWeightBold,
        fontSize: typography.pxToRem(12),
    },
    categories: {
        marginBottom: spacing(2),
    },
    categoriesSelect: {
        width: typography.pxToRem(180),
        marginTop: 0,
        marginBottom: spacing(2),
    },
    categoryButton: {
        fontWeight: typography.fontWeightBold,
        textTransform: 'none',
    },
    categoryActive: {
        color: palette.primary.main,
    },
}));

interface IColumnNames {
    name: string;
    type: string;
}

interface IListData {
    category: string;
}

function AddAction({ state, onClose, onAdd }: IObserveProps & IPublicProps) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchFilter, setSearchFilter] = useState('');
    const classes = useStyles();

    const translator = getTranslator(state);
    const actionTypes = getAsyncActionTypes(state).data || [];
    const listItems = mapActionTypesToListItems(actionTypes);
    const categories = getCategoriesFromListItems(listItems);
    const filteredListItems = filterListItemsOnCategory(
        listItems,
        selectedCategory || (categories.length > 0 ? categories[0] : ''),
    );

    return (
        <Box className={classes.dialog}>
            <Box
                className={classes.header}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding={1}
            >
                <Tooltip
                    title={translator('scripts.detail.main.add_action.search_button')}
                    enterDelay={1000}
                    enterNextDelay={1000}
                >
                    <IconButton
                        aria-label={translator('scripts.detail.main.add_action.search_button')}
                        className={classes.headerAction}
                        onClick={() => setIsSearchActive(!isSearchActive)}
                    >
                        <Search />
                    </IconButton>
                </Tooltip>
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
                <Box display="flex" justifyContent="center">
                    {categories.length > 5 ? (
                        <FormControl
                            variant="filled"
                            size="small"
                            className={classes.categoriesSelect}
                        >
                            <InputLabel id="select-action-category-label">
                                <Translate msg="scripts.detail.main.add_action.select_category" />
                            </InputLabel>
                            <Select
                                labelId="select-action-category-label"
                                id="select-action-category"
                                disableUnderline
                                value={selectedCategory || (categories.length > 0 ? categories[0] : '')}
                                onChange={(event: ChangeEvent<{ value: unknown }>) => {
                                    const category = event.target.value as string;
                                    if (category !== selectedCategory) {
                                        setSelectedCategory(category);
                                        setSelectedIds([]);
                                    }
                                }}
                            >
                                {categories.map((category) => (
                                    <MenuItem
                                        key={JSON.stringify(category)}
                                        value={category}
                                    >
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : (
                        <ButtonGroup
                            variant="contained"
                            aria-label="contained button group"
                            className={classes.categories}
                        >
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant="contained"
                                    disableElevation
                                    size="small"
                                    className={classnames(classes.categoryButton, {
                                        [classes.categoryActive]:
                                            category === (selectedCategory
                                                || (categories.length > 0 ? categories[0] : '')),
                                    })}
                                    onClick={() => {
                                        if (category !== selectedCategory) {
                                            setSelectedCategory(category);
                                            setSelectedIds([]);
                                        }
                                    }}
                                >
                                    {category}
                                </Button>
                            ))}
                        </ButtonGroup>
                    )}
                </Box>
                <GenericSelectableList
                    onChange={onSelectionChange}
                    columns={{
                        type: {
                            fixedWidth: '30%',
                            className: classes.actionType,
                        },
                        name: {
                            fixedWidth: '70%',
                            noWrap: true,
                            className: classes.actionName,
                        },
                    }}
                    filters={{
                        type: {
                            filterType: FilterType.Search,
                            values: [searchFilter],
                            name: 'type',
                        },
                    }}
                    sortedColumn={{
                        name: 'type',
                        sortOrder: SortOrder.Descending,
                        sortType: SortType.String,
                    }}
                    listItems={filteredListItems}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
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
        const actionsToAdd = actionTypes.filter((item) => selectedIds.includes(item.name));
        onAdd(actionsToAdd.map((item) => ({
            component: null,
            condition: '',
            description: 'default',
            errorExpected: false,
            errorStop: true,
            iteration: null,
            name: item.name,
            number: null,
            parameters: item.parameters.map((parameter) => ({
                name: parameter.name,
                value: '',
            })),
            retries: 0,
            type: item.type,
        })));
    }

    function mapActionTypesToListItems(items: IActionType[]) {
        return items.map((item) => {
            const listItem: IListItem<IColumnNames, IListData> = {
                id: item.name,
                columns: {
                    name: item.name,
                    type: item.type,
                },
                data: {
                    category: item.category,
                },
            };
            return listItem;
        });
    }

    function getCategoriesFromListItems(
        items: IListItem<IColumnNames, IListData>[],
    ) {
        return items.reduce((acc, listItem) => {
            const { category } = listItem.data;
            if (!acc.includes(category)) {
                acc.push(category);
            }
            return acc;
        }, [] as string[]);
    }

    function filterListItemsOnCategory(
        items: IListItem<IColumnNames, IListData>[],
        category: string,
    ) {
        return items.filter((item) => item.data.category === category);
    }
}

export default observe<IPublicProps>(
    [StateChangeNotification.I18N_TRANSLATIONS],
    AddAction,
);
