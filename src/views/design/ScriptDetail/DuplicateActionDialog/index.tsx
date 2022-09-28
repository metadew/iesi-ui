import React, { useState } from 'react';
import { Box, Button, makeStyles, TextField } from '@material-ui/core';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { IObserveProps, observe } from 'views/observe';
import { getTranslator } from 'state/i18n/selectors';
import { Alert } from '@material-ui/lab';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import { IScriptAction } from 'models/state/scripts.models';
import isSet from '@snipsonian/core/es/is/isSet';
import { StateChangeNotification } from 'models/state.models';

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
    action: IScriptAction;
    open: boolean;
    onDuplicate: (action: IScriptAction) => void;
    onClose: () => void;
}

function DuplicateActionDialog({
    onClose,
    onDuplicate,
    action,
    open,
    state,
}: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const [actionName, setActionName] = useState(action?.name);
    const translator = getTranslator(state);

    return (
        <ClosableDialog
            onClose={onClose}
            open={open}
            title={action && translator({
                msg: 'scripts.detail.duplicate_action_dialog.title',
                placeholders: {
                    actionName: action.name,
                },
            })}
        >
            <Box textAlign="left" maxWidth={400} marginX="auto">
                <>
                    {!isSet(action) && (
                        <Box marginBottom={2}>
                            <Alert severity="error">
                                <Translate msg="scripts.detail.duplicate_action_dialog.init_error" />
                            </Alert>
                        </Box>
                    )}
                    <Box marginBottom={2}>
                        <Translate msg="scripts.detail.duplicate_action_dialog.text" />
                    </Box>
                    <TextField
                        id="action-name"
                        type="text"
                        value={actionName}
                        label={translator('scripts.detail.duplicate_action_dialog.form.name')}
                        className={classes.formControl}
                        autoFocus
                        required
                        onChange={(e) => setActionName(e.target.value)}
                    />
                    <Box marginTop={2} textAlign="right">
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={createAction}
                            disabled={
                                !isSet(action)
                                || action.name.trim() === actionName.trim()
                                || actionName.trim().length <= 0
                            }
                        >
                            <Translate msg="scripts.detail.duplicate_action_dialog.confirm" />
                        </Button>
                    </Box>
                </>
            </Box>
        </ClosableDialog>
    );

    function createAction() {
        onDuplicate({
            ...action,
            name: actionName,
        });
        onClose();
    }
}

export default observe<IPublicProps>([
    StateChangeNotification.I18N_TRANSLATIONS,
    StateChangeNotification.DESIGN_SCRIPTS_DETAIL,
], DuplicateActionDialog);
