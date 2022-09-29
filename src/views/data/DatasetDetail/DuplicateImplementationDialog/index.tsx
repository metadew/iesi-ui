import React, { useRef, useState } from 'react';
import { Box, Button, Chip, makeStyles } from '@material-ui/core';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { IObserveProps, observe } from 'views/observe';
import { getTranslator } from 'state/i18n/selectors';
import { Alert, Autocomplete } from '@material-ui/lab';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import { IDatasetImplementation } from 'models/state/datasets.model';
import isSet from '@snipsonian/core/es/is/isSet';
import { StateChangeNotification } from 'models/state.models';
import TextInput from 'views/common/input/TextInput';

const useStyles = makeStyles(({ spacing, typography, palette }) => ({
    formControl: {
        width: '100%',
        marginBottom: spacing(2),
        '& .SpinningDots': {
            fontSize: typography.pxToRem(4),
        },
    },
    textField: {
        marginTop: 0,
        '& .MuiFilledInput-root': {
            background: palette.background.paper,
        },
    },
}));

interface IPublicProps {
    implementation: IDatasetImplementation;
    open: boolean;
    onDuplicate: (implementation: IDatasetImplementation) => void;
    onClose: () => void;
}

function DuplicateImplementationDialog({
    onClose,
    onDuplicate,
    implementation,
    open,
    state,
}: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const ref = useRef(null);
    const [isLabelsEmpty, setIsLabelsEmpty] = useState<boolean>(false);
    const translator = getTranslator(state);

    return (
        <ClosableDialog
            onClose={onClose}
            open={open}
            title={implementation && translator('datasets.detail.duplicate_implementation_dialog.title')}
        >
            <Box textAlign="left" maxWidth={400} marginX="auto">
                <>
                    {!isSet(implementation) && (
                        <Box marginBottom={2}>
                            <Alert severity="error">
                                <Translate msg="scripts.detail.duplicate_action_dialog.init_error" />
                            </Alert>
                        </Box>
                    )}
                    <Box marginBottom={2}>
                        <Translate msg="scripts.detail.duplicate_action_dialog.text" />
                    </Box>
                    <Autocomplete
                        ref={ref}
                        multiple
                        id="implementation-labels"
                        options={[]}
                        defaultValue={[...implementation.labels.map((label) => label.label)]}
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

                    <Box marginTop={2} textAlign="right">
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={createImplementation}
                            disabled={!isSet(implementation)}
                        >
                            <Translate msg="scripts.detail.duplicate_action_dialog.confirm" />
                        </Button>
                    </Box>
                </>
            </Box>
        </ClosableDialog>
    );

    function createImplementation() {
        const outerTexts: Array<string> = ref.current.outerText.split('\n');
        const labels: Array<string> = outerTexts.slice(1, outerTexts.length - 1).filter((label) => label.length > 0);
        if (labels.length <= 0) {
            setIsLabelsEmpty(true);
        } else {
            onDuplicate({
                ...implementation,
                labels: labels.map((label) => ({ label })),
            });
            onClose();
        }
    }
}

export default observe<IPublicProps>([
    StateChangeNotification.I18N_TRANSLATIONS,
    StateChangeNotification.DATA_DATASETS_DETAIL,
], DuplicateImplementationDialog);
