import React, { useEffect, useState } from 'react';
import {
    Button,
    Box,
    makeStyles,
    TextField,
} from '@material-ui/core';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { observe, IObserveProps } from 'views/observe';
import { getScriptByUniqueIdFromDetailOrList } from 'state/entities/scripts/selectors';
import { StateChangeNotification } from 'models/state.models';
import { getTranslator } from 'state/i18n/selectors';
import { AsyncOperation, AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import Loader from 'views/common/waiting/Loader';
import { Alert } from '@material-ui/lab';
import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import isSet from '@snipsonian/core/es/is/isSet';
import { triggerCreateScriptDetail, triggerResetAsyncScriptDetail } from 'state/entities/scripts/triggers';

const useStyles = makeStyles(({ spacing, typography }) => ({
    formControl: {
        width: '100%',
        marginBottom: spacing(2),
        '& .SpinningDots': {
            fontSize: typography.pxToRem(4),
        },
    },
}));

interface IPublicProps {
    scriptUniqueId: string;
    open: boolean;
    onClose: () => void;
}

function DuplicateScriptDialog({
    onClose,
    scriptUniqueId,
    open,
    state,
}: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const script = getScriptByUniqueIdFromDetailOrList(state, scriptUniqueId);
    const [scriptName, setScriptName] = useState(script?.name);
    const translator = getTranslator(state);
    const createAsyncInfo = entitiesStateManager.getAsyncEntity({
        asyncEntityKey: ASYNC_ENTITY_KEYS.scriptDetail,
    }).create;

    useEffect(() => {
        if (!open && createAsyncInfo.status === AsyncStatus.Success) {
            triggerResetAsyncScriptDetail({
                resetDataOnTrigger: true,
                operation: AsyncOperation.create,
            });
        }
    }, [open, createAsyncInfo]);

    return (
        <ClosableDialog
            onClose={onClose}
            open={open}
            title={script && `Duplicating ${script.name}`}
        >
            <Box textAlign="left" maxWidth={400} marginX="auto">
                {createAsyncInfo.status === AsyncStatus.Success ? (
                    <>
                        <Alert severity="success">
                            <Translate msg="scripts.overview.duplicate_script_dialog.success.text" />
                        </Alert>
                        <Box marginTop={2} textAlign="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onClose}
                            >
                                <Translate msg="scripts.overview.duplicate_script_dialog.success.close_button" />
                            </Button>
                        </Box>
                    </>
                ) : (
                    <>
                        <Loader show={createAsyncInfo.status === AsyncStatus.Busy} />
                        {!isSet(script) && (
                            <Box marginBottom={2}>
                                <Alert severity="error">
                                    <Translate msg="scripts.overview.duplicate_script_dialog.init_error" />
                                </Alert>
                            </Box>
                        )}
                        <Box marginBottom={2}>
                            <Translate msg="scripts.overview.duplicate_script_dialog.text" />
                        </Box>
                        <TextField
                            id="execute-script-name"
                            type="text"
                            value={scriptName}
                            label={translator('scripts.overview.duplicate_script_dialog.form.name')}
                            className={classes.formControl}
                            autoFocus
                            required
                            onChange={(e) => setScriptName(e.target.value)}
                        />
                        {createAsyncInfo.error && (
                            <Box marginTop={2}>
                                <Alert severity="error">
                                    {isSet(createAsyncInfo?.error?.response?.message) ? (
                                        createAsyncInfo.error.response.message
                                    ) : (
                                        <Translate msg="scripts.overview.duplicate_script_dialog.error" />
                                    )}
                                </Alert>
                            </Box>
                        )}
                        <Box marginTop={2} textAlign="right">
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={createScript}
                                disabled={
                                    !isSet(script)
                                    || script.name.trim() === scriptName.trim()
                                    || scriptName.trim().length <= 0
                                }
                            >
                                <Translate msg="scripts.overview.duplicate_script_dialog.confirm" />
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </ClosableDialog>
    );

    function createScript() {
        triggerCreateScriptDetail({
            ...script,
            name: scriptName,
            version: {
                ...script.version,
                number: 0,
            },
        });
    }
}

export default observe<IPublicProps>([
    StateChangeNotification.I18N_TRANSLATIONS,
    StateChangeNotification.DESIGN_SCRIPTS_DETAIL,
], DuplicateScriptDialog);
