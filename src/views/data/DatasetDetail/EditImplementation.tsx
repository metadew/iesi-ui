import React, { useRef, useState } from 'react';
import classnames from 'classnames';
import { Box, Button, ButtonGroup, Chip, darken, IconButton, makeStyles, Paper, Typography } from '@material-ui/core';
import { AddRounded as AddIcon, RemoveCircle as RemoveIcon } from '@material-ui/icons';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { THEME_COLORS } from 'config/themes/colors';
import { getTranslator } from 'state/i18n/selectors';
import { IObserveProps, observe } from 'views/observe';
import TextInput from 'views/common/input/TextInput';
import { Autocomplete } from '@material-ui/lab';
import Tooltip from 'views/common/tooltips/Tooltip';
import { IDatasetImplementation, IKeyValue } from 'models/state/datasets.model';
import { checkAuthority } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';

const useStyles = makeStyles(({ palette, typography }) => ({
    dialog: {
        background: palette.background.default,
    },
    header: {
        background: palette.background.paper,
    },
    index: {
        fontWeight: typography.fontWeightBold,
        textAlign: 'center',
    },
    textField: {
        marginTop: 0,
        '& .MuiFilledInput-root': {
            background: palette.background.paper,
        },
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
    paper: {
        padding: 8,
    },
    keyInput: {
        marginRight: 4,
    },
    valueInput: {
        marginLeft: 4,
    },
    addButton: {
        backgroundColor: palette.type === 'light'
            ? THEME_COLORS.GREY_LIGHT
            : darken(THEME_COLORS.GREY_DARK, 0.2),
    },
}));

interface IPublicProps {
    isEdit?: boolean;
    onClose: () => void;
    onEdit: (implementation: IDatasetImplementation) => void;
    implementation?: IDatasetImplementation;
}

function EditImplementation({
    state,
    onEdit,
    onClose,
    implementation,
}: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const translator = getTranslator(state);
    const ref = useRef(null);
    const [isLabelsEmpty, setIsLabelsEmpty] = useState<boolean>(false);
    const [keyValues, setKeyValues] = useState<Array<IKeyValue>>(
        implementation
            ? implementation.keyValues.sort((a, b) => (a.key.toLowerCase() > b.key.toLowerCase() ? 1 : -1))
            : [],
    );

    const add = () => {
        const outerTexts: Array<string> = ref.current.outerText.split('\n');
        const labels: Array<string> = outerTexts.slice(1, outerTexts.length - 1).filter((label) => label.length > 0);
        if (labels.length <= 0) {
            setIsLabelsEmpty(true);
        } else {
            onEdit({
                type: 'database',
                labels: labels.map((label) => ({ label })),
                keyValues,
            });
            onClose();
        }
    };

    const addValue = () => {
        setKeyValues([...keyValues, {
            uuid: keyValues.length === 0 ? 1 : keyValues[keyValues.length - 1].uuid + 1,
            key: '',
            value: '',
        }]);
    };

    const removeValue = (uuid: number) => {
        setKeyValues(keyValues.filter((keyValue) => keyValue.uuid !== uuid));
    };

    const onKeyChanges = (newKey: string, uuid: number) => {
        setKeyValues(
            keyValues.map((keyValue) => {
                if (keyValue.uuid === uuid) {
                    return { ...keyValue, key: newKey };
                }
                return keyValue;
            }),
        );
    };

    const onValueChanges = (newValue: string, uuid: number) => {
        setKeyValues(
            keyValues.map((keyValue) => {
                if (keyValue.uuid === uuid) {
                    return { ...keyValue, value: newValue };
                }
                return keyValue;
            }),
        );
    };

    return (
        <Box className={classes.dialog}>
            <Box
                className={classes.header}
                display="flex"
                justifyContent="center"
                alignItems="center"
                padding={2}
            >
                <Typography variant="h2">
                    <Translate msg="datasets.detail.edit.implementation.title_create" />
                </Typography>
            </Box>
            <Box padding={2}>
                <Box marginBottom={2}>
                    <Paper className={classes.paper}>
                        <Autocomplete
                            disabled={!checkAuthority(state, SECURITY_PRIVILEGES.S_DATASETS_WRITE)}
                            ref={ref}
                            multiple
                            id="implementation-labels"
                            options={[]}
                            defaultValue={implementation ? [...implementation.labels.map((label) => label.label)] : []}
                            freeSolo
                            renderTags={(value: string[], getTagProps) => (
                                value.map((option: string, index: number) => (
                                    <Chip
                                        variant="outlined"
                                        label={option}
                                        {...getTagProps({ index })}
                                    />
                                ))
                            )}
                            renderInput={(params) => (
                                <TextInput
                                    {...params}
                                    variant="standard"
                                    label="labels"
                                    InputProps={{
                                        ...params.InputProps,
                                        disableUnderline: true,
                                        autoComplete: 'off',
                                    }}
                                    helperText={isLabelsEmpty ? (
                                        translator('datasets.detail.edit.implementation.empty_labels_error')
                                    ) : translator('datasets.detail.edit.implementation.labels_helper')}
                                    error={isLabelsEmpty}
                                    className={classes.textField}
                                    fullWidth
                                    autoFocus
                                    required
                                />
                            )}
                        />
                    </Paper>
                </Box>
                {
                    checkAuthority(state, SECURITY_PRIVILEGES.S_DATASETS_WRITE) && (
                        <Box marginBottom={2}>
                            <Tooltip
                                title={translator('datasets.detail.edit.implementation.add_key_values')}
                                enterDelay={1000}
                                enterNextDelay={1000}
                            >
                                <IconButton
                                    aria-label={translator('datasets.detail.edit.implementation.add_key_values')}
                                    className={classes.addButton}
                                    onClick={addValue}
                                    color="default"
                                >
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )
                }
                {
                    keyValues.length > 0 && keyValues.map((keyValue) => (
                        <Box
                            key={keyValue.uuid}
                            width="100%"
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            marginBottom={2}
                        >
                            <Box flex="1">
                                <Paper className={classnames(classes.paper, classes.keyInput)}>
                                    <TextInput
                                        variant="standard"
                                        label="key"
                                        InputProps={{
                                            disableUnderline: true,
                                            autoComplete: 'off',
                                        }}
                                        className={classes.textField}
                                        defaultValue={keyValue.key}
                                        onChange={(e) => onKeyChanges(e.target.value, keyValue.uuid)}
                                        disabled={!checkAuthority(state, SECURITY_PRIVILEGES.S_DATASETS_WRITE)}
                                        fullWidth
                                    />
                                </Paper>
                            </Box>
                            <Box flex="1">
                                <Paper className={classnames(classes.paper, classes.valueInput)}>
                                    <TextInput
                                        variant="standard"
                                        label="value"
                                        InputProps={{
                                            disableUnderline: true,
                                            autoComplete: 'off',
                                        }}
                                        className={classes.textField}
                                        defaultValue={keyValue.value}
                                        onChange={(e) => onValueChanges(e.target.value, keyValue.uuid)}
                                        disabled={!checkAuthority(state, SECURITY_PRIVILEGES.S_DATASETS_WRITE)}
                                        fullWidth
                                    />
                                </Paper>
                            </Box>
                            {
                                checkAuthority(state, SECURITY_PRIVILEGES.S_DATASETS_WRITE) && (
                                    <Box marginLeft={1}>
                                        <Tooltip
                                            title={translator('datasets.detail.edit.implementation.remove_key_values')}
                                            enterDelay={1000}
                                            enterNextDelay={1000}
                                        >
                                            <IconButton
                                                aria-label={translator(
                                                    'datasets.detail.edit.implementation.remove_key_values',
                                                )}
                                                className={classes.addButton}
                                                onClick={() => removeValue(keyValue.uuid)}
                                                color="default"
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                )
                            }
                        </Box>
                    ))
                }
                <Box marginTop={3} textAlign="right">
                    {
                        checkAuthority(state, SECURITY_PRIVILEGES.S_DATASETS_WRITE) ? (

                            <ButtonGroup size="small">
                                <Button
                                    variant="outlined"
                                    color="default"
                                    onClick={onClose}
                                    disableElevation
                                >
                                    <Translate msg="datasets.detail.edit.implementation.footer.cancel" />
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={add}
                                    disableElevation
                                >
                                    <Translate msg="datasets.detail.edit.implementation.footer.save" />
                                </Button>
                            </ButtonGroup>
                        ) : (
                            <Button
                                variant="outlined"
                                color="default"
                                size="small"
                                onClick={onClose}
                                disableElevation
                            >
                                <Translate msg="datasets.detail.edit.implementation.footer.close" />
                            </Button>
                        )
                    }
                </Box>
            </Box>
        </Box>
    );
}

export default observe<IPublicProps>([], EditImplementation);
