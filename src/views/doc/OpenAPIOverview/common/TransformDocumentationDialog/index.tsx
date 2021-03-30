import React, { useState, ChangeEvent } from 'react';
import {
    Button,
    Box,
    Typography,
    IconButton,
    TextField,
} from '@material-ui/core';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import { Delete } from '@material-ui/icons';
import { triggerCreateTransformDocumentation } from 'state/entities/openapi/triggers';

interface IPublicProps {
    open: boolean;
    onClose: () => void;
    onOpen: () => void;
}

interface IFormValues {
    textDoc: string;
    fileDoc: File | undefined;
}

function TransformDocumentationDialog({ onClose, open, onOpen }: IPublicProps) {
    const [formValues, setFormValues] = useState<IFormValues>({
        textDoc: '',
        fileDoc: undefined,
    });
    const handleTextDocChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.persist();
        if (e.target.value.length === 1 && formValues.fileDoc) {
            setFormValues((state) => ({ ...state, textDoc: e.target.value, fileDoc: undefined }));
            return;
        }
        setFormValues((state) => ({ ...state, textDoc: e.target.value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        // const newFile = e.target.files[0];
        e.persist();
        if (e.target.files[0] && formValues.textDoc.length > 0) {
            console.log('TEST MEC : ', e.target.files[0]);
            setFormValues((state) => ({ ...state, fileDoc: e.target.files[0], textDoc: '' }));
            return;
        }
        setFormValues((state) => ({ ...state, fileDoc: e.target.files[0] }));
    };

    const onDeleteFile = () => {
        setFormValues((state) => ({ ...state, fileDoc: undefined }));
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={onOpen}
            >
                Load doc
            </Button>
            <ClosableDialog
                onClose={onClose}
                open={open}
                title="Provide an OpenAPI documentation to perform the transformation"
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
                                label="Json Content"
                                variant="filled"
                                rows={20}
                                multiline
                                fullWidth
                                value={formValues.textDoc}
                                onChange={handleTextDocChange}
                            />
                        </Box>

                        <Typography style={{ marginTop: 4, marginBottom: 4 }}>OR</Typography>
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
                                        Choose a file
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
                                    <>
                                        <Typography variant="subtitle1">Only .JSON and .YAML</Typography>
                                        <Typography variant="subtitle1">are accepted</Typography>
                                    </>
                                )
                            }

                        </Box>
                    </Box>
                </Box>
                <Box display="flex" width="100%" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={createTransformResult}
                        style={{
                            marginRight: 8,
                        }}
                    >
                        Validate
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
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

export default TransformDocumentationDialog;
