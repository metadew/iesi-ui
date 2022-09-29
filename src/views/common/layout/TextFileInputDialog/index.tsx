import React, { ChangeEvent, useRef } from 'react';
import { Box, Button, ButtonGroup, makeStyles, Theme, Typography } from '@material-ui/core';
import { Publish as ImportIcon } from '@material-ui/icons';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getTranslator } from 'state/i18n/selectors';
import { IObserveProps, observe } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import TextInput from 'views/common/input/TextInput';
import Loader from 'views/common/waiting/Loader';
import { IImportPayload } from 'models/state/iesiGeneric.models';

const useStyles = makeStyles(({ palette, typography }: Theme) => ({
    generateTooltip: {
        backgroundColor: palette.common.black,
        fontSize: typography.pxToRem(12),
        padding: 16,
    },
    generateTooltipArrow: {
        color: palette.common.black,
    },
    inputDivider: {
        marginTop: 4,
        marginBottom: 4,
    },
    fileHelper: {
        marginTop: 2,
        marignBottom: 2,
        fontSize: typography.pxToRem(12),
        color: palette.grey[500],
    },
    buttonGroup: {
        marginTop: 8,
    },
    validateButton: {
        marginRight: 8,
    },
}));

interface IPublicProps {
    open: boolean;
    onClose: () => void;
    onOpen: () => void;
    onImport: (payload: IImportPayload) => void;
    showLoader: boolean;
    metadataName?: string;
}

function ImportDatasetDialog({
    onClose,
    open,
    onOpen,
    onImport,
    showLoader,
    metadataName,
    state,
}: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const translator = getTranslator(state);
    const inputText = useRef<HTMLInputElement>(null);
    const inputFile = useRef<HTMLInputElement>(null);

    const onFileButtonClick = () => {
        inputFile.current.click();
    };

    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            onImport({ value: formData });
        }
    };

    return (
        <>
            <Button
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<ImportIcon />}
                onClick={onOpen}
            >
                <Translate
                    msg="common.import.dialog.title"
                    placeholders={{
                        metadataName,
                    }}
                />
            </Button>
            <ClosableDialog
                onClose={onClose}
                open={open}
                title={translator({
                    msg: 'common.import.dialog.title',
                    placeholders: {
                        metadataName,
                    },
                })}
                fullWidth
            >
                {showLoader ? (
                    <Loader show={showLoader} />
                ) : (
                    <>
                        <Box marginX="auto" width="100%">
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="space-between"
                                alignItems="center"
                                width="100%"
                            >
                                <Box flex={1} width="100%">
                                    <TextInput
                                        label={translator('common.import.dialog.input_placeholder')}
                                        variant="filled"
                                        type="textarea"
                                        rows={20}
                                        inputRef={inputText}
                                        multiline
                                        fullWidth
                                    />
                                    <TextInput
                                        type="file"
                                        id="file-dataset"
                                        inputRef={inputFile}
                                        style={{ display: 'none' }}
                                        onChange={onFileChange}
                                    />
                                </Box>
                            </Box>
                        </Box>
                        <Box
                            display="flex"
                            width="100%"
                            justifyContent="space-between"
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={onFileButtonClick}
                            >
                                <Typography>
                                    <Translate msg="common.import.dialog.import_file_button" />
                                </Typography>
                            </Button>
                            <ButtonGroup
                                size="small"
                                className={classes.buttonGroup}
                            >
                                <Button
                                    variant="outlined"
                                    color="default"
                                    onClick={onClose}
                                >
                                    <Translate msg="common.action.cancel" />
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() =>
                                        onImport({
                                            value: inputText.current.value,
                                        })}
                                    className={classes.validateButton}
                                >
                                    <Translate msg="common.import.dialog.import_button" />
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </>
                )}
            </ClosableDialog>
        </>
    );
}

export default observe<IPublicProps>(
    [
        StateChangeNotification.DESIGN_SCRIPTS_DETAIL,
        StateChangeNotification.DESIGN_COMPONENT_DETAIL,
        StateChangeNotification.DATA_DATASETS_DETAIL,
    ],
    ImportDatasetDialog,
);
