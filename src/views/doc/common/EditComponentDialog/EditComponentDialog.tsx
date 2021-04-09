import React, { useRef } from 'react';
import {
    Button,
    Box,
    TextField,
    makeStyles,
    Theme,
    Select,
    MenuItem,
} from '@material-ui/core';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getTranslator } from 'state/i18n/selectors';
import { IObserveProps, observe } from 'views/observe';
import { editComponent } from 'state/ui/actions';
import { StateChangeNotification } from 'models/state.models';
import { getAsyncTransformResultEntity } from 'state/entities/openapi/selectors';
import { IComponentEntity } from 'models/state/components.model';
import { componentsEqual } from 'utils/components/componentUtils';

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
    input: {
        marginTop: 4,
        marginBottom: 4,
    },
    select: {
        alignSelf: 'flex-start',
        width: '100%',
    },
    footer: {
        marginTop: 8,
        marginbottom: 4,
    },
}));

interface IPublicProps {
    open: boolean;
    onClose: () => void;
    component: IComponentEntity | undefined;
}

function EditComponentDialog({ onClose, open, state, dispatch, component }: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const translator = getTranslator(state);
    const { connections = [] } = getAsyncTransformResultEntity(state).data || {};
    const nameInput = useRef<HTMLInputElement>();
    const descriptionInput = useRef<HTMLInputElement>();
    const versionNumberInput = useRef<HTMLInputElement>();
    const versionDescInput = useRef<HTMLInputElement>();
    const endpointInput = useRef<HTMLInputElement>();
    const typeInput = useRef<HTMLInputElement>();
    const connSelect = useRef<HTMLSelectElement>();

    if (!component) return <></>;

    const onValidateClick = () => {
        const newComponent: IComponentEntity = {
            name: nameInput.current.value,
            type: component.type,
            description: descriptionInput.current.value,
            version: {
                number: parseFloat(versionNumberInput.current.value),
                description: versionDescInput.current.value,
            },
            parameters: [{
                name: 'endpoint',
                value: endpointInput.current.value,
            }, {
                name: 'type',
                value: typeInput.current.value,
            }, {
                name: 'connection',
                value: connSelect.current.value,
            }],
            attributes: [],
            isHandled: true,
        };

        if (!componentsEqual(component, newComponent)) {
            dispatch(editComponent({
                currentComponent: component,
                newComponent,
            }));
        }
        onClose();
    };

    return (
        <ClosableDialog
            onClose={onClose}
            open={open}
            title={translator('doc.dialog.edit.component.title')}
        >
            <Box marginX="auto" width="100%">
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                >
                    <TextField
                        variant="filled"
                        defaultValue={component.name}
                        label={translator('doc.dialog.edit.component.name')}
                        fullWidth
                        inputRef={nameInput}
                        className={classes.input}
                    />
                    <TextField
                        variant="filled"
                        defaultValue={component.description}
                        label={translator('doc.dialog.edit.component.description')}
                        fullWidth
                        inputRef={descriptionInput}
                        className={classes.input}
                    />
                    <TextField
                        variant="filled"
                        defaultValue={component.version.number}
                        label={translator('doc.dialog.edit.component.versionNumber')}
                        fullWidth
                        inputRef={versionNumberInput}
                        className={classes.input}
                    />
                    <TextField
                        variant="filled"
                        defaultValue={component.version.description}
                        label={translator('doc.dialog.edit.component.versionDescription')}
                        fullWidth
                        inputRef={versionDescInput}
                        className={classes.input}
                    />
                    <TextField
                        variant="filled"
                        defaultValue={component.parameters[0].value}
                        label={translator('doc.dialog.edit.component.endpoint')}
                        fullWidth
                        inputRef={endpointInput}
                        className={classes.input}
                    />
                    <TextField
                        variant="filled"
                        defaultValue={component.parameters[1].value}
                        label={translator('doc.dialog.edit.component.type')}
                        fullWidth
                        inputRef={typeInput}
                        className={classes.input}
                    />
                    <Select
                        labelId="connection-label"
                        id="connection"
                        defaultValue={component.parameters[2].value}
                        inputRef={connSelect}
                        className={`${classes.select} ${classes.input}`}
                    >
                        {connections && connections.map((connection) => (
                            <MenuItem
                                key={JSON.stringify(connection.name)}
                                value={connection.name}
                            >
                                {connection.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            </Box>
            <Box display="flex" width="100%" justifyContent="flex-end" className={classes.footer}>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className={classes.validateButton}
                    onClick={onValidateClick}
                >
                    <Translate
                        msg="doc.dialog.transform.validate"
                    />
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={onClose}
                >
                    <Translate
                        msg="common.action.cancel"
                    />
                </Button>
            </Box>
        </ClosableDialog>

    );
}

export default observe<IPublicProps>([StateChangeNotification.ENVIRONMENTS], EditComponentDialog);
