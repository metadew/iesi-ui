import React, { useState, ChangeEvent } from 'react';
import {
    Button,
    ButtonGroup,
    Box,
    Typography,
    IconButton,
    TextField,
    makeStyles,
    Tooltip,
    Theme,
} from '@material-ui/core';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import { Delete } from '@material-ui/icons';
import { triggerCreateTransformDocumentation } from 'state/entities/openapi/triggers';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getTranslator } from 'state/i18n/selectors';
import { IObserveProps, observe } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';

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
        marginTop: 4, marginBottom: 4,
    },
    fileHelper: {
        marginTop: 2,
        marginBottom: 2,
        fontSize: typography.pxToRem(12),
        color: palette.grey[500],
    },
    validateButton: {
        marginRight: 8,
    },
}));

interface IPublicProps {
    open: boolean;
    onClose: () => void;
    onOpen: () => void;
}

interface IFormValues {
    textDoc: string;
    fileDoc: File | undefined;
}

function TransformDocumentationDialog({ onClose, open, onOpen, state }: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const translator = getTranslator(state);
    const [formValues, setFormValues] = useState<IFormValues>({
        textDoc: '',
        fileDoc: undefined,
    });

    const handleTextDocChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.persist();
        if (e.target.value.length === 1 && formValues.fileDoc) {
            setFormValues((currentState) => ({ ...currentState, textDoc: e.target.value, fileDoc: undefined }));
            return;
        }
        setFormValues((currentState) => ({ ...currentState, textDoc: e.target.value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        // const newFile = e.target.files[0];
        e.persist();
        if (e.target.files[0] && formValues.textDoc.length > 0) {
            setFormValues((currentState) => ({ ...currentState, fileDoc: e.target.files[0], textDoc: '' }));
            return;
        }
        setFormValues((currentState) => ({ ...currentState, fileDoc: e.target.files[0] }));
    };

    const onDeleteFile = () => {
        setFormValues((currentState) => ({ ...currentState, fileDoc: undefined }));
    };

    return (
        <>
            <Tooltip
                title={translator('scripts.overview.header.transform_openapi_tooltip')}
                placement="top"
                classes={{
                    tooltip: classes.generateTooltip,
                    arrow: classes.generateTooltipArrow,
                }}
                arrow
            >
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={onOpen}
                >
                    <Translate
                        msg="scripts.overview.header.generate_button"
                    />
                </Button>
            </Tooltip>
            <ClosableDialog
                onClose={onClose}
                open={open}
                title={translator('doc.dialog.transform.title')}
            >
                <Box marginX="auto" width="100%">
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        alignItems="center"
                        width="100%"
                    >
                        <Box flex={1} width="100%">
                            <TextField
                                label={translator('doc.dialog.transform.json_content_label')}
                                variant="filled"
                                rows={20}
                                multiline
                                fullWidth
                                value={formValues.textDoc}
                                onChange={handleTextDocChange}
                            />
                        </Box>

                        <Typography variant="body1" className={classes.inputDivider}>OR</Typography>
                        <Box
                            display="flex"
                            flexDirection="column"
                        >
                            <form>
                                <label htmlFor="doc-upload-input">
                                    <input
                                        type="file"
                                        id="doc-upload-input"
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        component="span"
                                        size="small"
                                    >
                                        <Translate
                                            msg="doc.dialog.transform.file_label"
                                        />
                                    </Button>
                                </label>
                            </form>

                            {
                                formValues.fileDoc ? (
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="subtitle1">{formValues.fileDoc.name}</Typography>
                                        <IconButton size="small" onClick={onDeleteFile}>
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Typography variant="subtitle1" className={classes.fileHelper}>
                                        {translator('doc.dialog.transform.file_helper')}
                                    </Typography>
                                )
                            }

                        </Box>
                    </Box>
                </Box>
                <Box display="flex" width="100%" justifyContent="flex-end">
                    <ButtonGroup size="small">
                        <Button
                            variant="outlined"
                            color="default"
                            onClick={onClose}
                        >
                            <Translate
                                msg="common.action.cancel"
                            />
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={createTransformResult}
                            className={classes.validateButton}
                        >
                            <Translate
                                msg="doc.dialog.transform.validate"
                            />
                        </Button>
                    </ButtonGroup>

                </Box>
            </ClosableDialog>
        </>

    );

    function createTransformResult() {
        if (formValues.fileDoc) {
            const formData = new FormData();
            formData.append('file', formValues.fileDoc);
            triggerCreateTransformDocumentation({ value: formData });
            return;
        }
        triggerCreateTransformDocumentation({ value: formValues.textDoc });
    }
}

export default observe<IPublicProps>([StateChangeNotification.OPENAPI_TRANSFORM], TransformDocumentationDialog);
