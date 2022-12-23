import React, { useEffect, useState } from 'react';
import { Box, Button, makeStyles, TextField } from '@material-ui/core';
import { IObserveProps, observe } from 'views/observe';
import { getComponentByUniqueIdFromDetailOrList } from 'state/entities/components/selectors';
import { getTranslator } from 'state/i18n/selectors';
import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { AsyncOperation, AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { triggerCreateComponentDetail, triggerResetAsyncComponentDetail } from 'state/entities/components/triggers';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import { Alert } from '@material-ui/lab';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import Loader from 'views/common/waiting/Loader';
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
    componentUniqueId: string;
    open: boolean;
    onClose: () => void;
}

function DuplicateComponentDialog({
    onClose,
    componentUniqueId,
    open,
    state,
}: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const component = getComponentByUniqueIdFromDetailOrList(state, componentUniqueId);
    const [componentName, setComponentName] = useState(component?.name);
    const translator = getTranslator(state);
    const createAsyncInfo = entitiesStateManager.getAsyncEntity({
        asyncEntityKey: ASYNC_ENTITY_KEYS.componentDetail,
    }).create;

    useEffect(() => {
        if (!open && createAsyncInfo.status === AsyncStatus.Success) {
            triggerResetAsyncComponentDetail({
                resetDataOnTrigger: true,
                operation: AsyncOperation.create,
            });
        }
    }, [open, createAsyncInfo]);

    return (
        <ClosableDialog
            onClose={onClose}
            open={open}
            title={component && `Duplicating ${component.name}`}
        >
            <Box textAlign="left" maxWidth={400} marginX="auto">
                {createAsyncInfo.status === AsyncStatus.Success ? (
                    <>
                        <Alert severity="success">
                            <Translate msg="components.overview.duplicate_component_dialog.success.text" />
                        </Alert>
                        <Box marginTop={2} textAlign="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onClose}
                            >
                                <Translate
                                    msg="components.overview.duplicate_component_dialog.success.close_button"
                                />
                            </Button>
                        </Box>
                    </>
                ) : (
                    <>
                        <Loader show={createAsyncInfo.status === AsyncStatus.Busy} />
                        {!isSet(component) && (
                            <Box marginBottom={2}>
                                <Alert severity="error">
                                    <Translate msg="components.overview.duplicate_component_dialog.init_error" />
                                </Alert>
                            </Box>
                        )}
                        <Box marginBottom={2}>
                            <Translate msg="components.overview.duplicate_component_dialog.text" />
                        </Box>
                        <TextField
                            id="duplicate-script-name"
                            type="text"
                            value={componentName}
                            label={translator('components.overview.duplicate_component_dialog.form.name')}
                            className={classes.formControl}
                            autoFocus
                            required
                            onChange={(e) => setComponentName(e.target.value)}
                        />
                        {createAsyncInfo.error && (
                            <Box marginTop={2}>
                                <Alert severity="error">
                                    {isSet(createAsyncInfo?.error?.response?.message) ? (
                                        createAsyncInfo.error.response.message
                                    ) : (
                                        <Translate msg="components.overview.duplicate_component_dialog.error" />
                                    )}
                                </Alert>
                            </Box>
                        )}
                        <Box marginTop={2} textAlign="right">
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={createComponent}
                                disabled={
                                    !isSet(component)
                                    || component.name.trim() === componentName.trim()
                                    || componentName.trim().length <= 0
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

    function createComponent() {
        triggerCreateComponentDetail({
            ...component,
            name: componentName,
            version: {
                ...component.version,
                number: 0,
            },
        });
    }
}

export default observe<IPublicProps>([
    StateChangeNotification.I18N_TRANSLATIONS,
    StateChangeNotification.DESIGN_COMPONENT_DETAIL,
], DuplicateComponentDialog);
