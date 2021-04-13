import React, { useRef } from 'react';
import {
    Button,
    Box,
    TextField,
    makeStyles,
    ButtonGroup,
} from '@material-ui/core';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getTranslator } from 'state/i18n/selectors';
import { IObserveProps, observe } from 'views/observe';
import { editComponent } from 'state/ui/actions';
import { StateChangeNotification } from 'models/state.models';
import { IComponentEntity } from 'models/state/components.model';
import { componentsEqual } from 'utils/components/componentUtils';

const useStyles = makeStyles(() => ({
    content: {
        width: '600px',
    },
    input: {
        marginTop: 6,
        marginBottom: 6,
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
    const nameInput = useRef<HTMLInputElement>();
    const descriptionInput = useRef<HTMLInputElement>();
    const versionNumberInput = useRef<HTMLInputElement>();
    const versionDescInput = useRef<HTMLInputElement>();
    const endpointInput = useRef<HTMLInputElement>();
    const typeInput = useRef<HTMLInputElement>();

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
                value: component.parameters[2].value,
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
            contentClassName={classes.content}
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
                    <TextField
                        variant="filled"
                        defaultValue={component.parameters[2].value}
                        label="Connection"
                        fullWidth
                        inputProps={{
                            readOnly: true,
                        }}
                        className={classes.input}
                    />
                </Box>
            </Box>
            <Box display="flex" width="100%" justifyContent="flex-end" className={classes.footer}>
                <ButtonGroup size="small">
                    <Button
                        variant="outlined"
                        color="default"
                        size="small"
                        onClick={onClose}
                    >
                        <Translate
                            msg="doc.dialog.edit.component.footer.cancel"
                        />
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={onValidateClick}
                    >
                        <Translate
                            msg="doc.dialog.edit.component.footer.save"
                        />
                    </Button>
                </ButtonGroup>
            </Box>
        </ClosableDialog>

    );
}

export default observe<IPublicProps>([StateChangeNotification.ENVIRONMENTS], EditComponentDialog);
