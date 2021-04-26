import React, { useState } from 'react';
import { IComponentParameter } from 'models/state/components.model';
import { IObserveProps, observe } from 'views/observe';
import { Box, makeStyles, Paper, Theme } from '@material-ui/core';
import TextInput from 'views/common/input/TextInput';
import { getTranslator } from 'state/i18n/selectors';

interface IPublicProps {
    parameter: IComponentParameter;
    onClose: () => void;
    onEdit: (parameter: IComponentParameter) => void;
    isCreateComponentRoute: boolean;
}

const useStyles = makeStyles(({ palette }: Theme) => ({
    dialog: {
        background: palette.background.default,
    },
    textField: {
        marginTop: 0,
        '& .MuiFilledInput-root': {
            background: palette.background.paper,
        },
    },
}));

function EditParameter({
    parameter,
    state,
}: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const [name, setName] = useState(parameter.name);
    const [value, setValue] = useState(parameter.value);
    const translator = getTranslator(state);
    return (
        <Box className={classes.dialog}>
            <Box padding={2}>
                <Box marginBottom={2}>
                    <Paper>
                        <TextInput
                            id="parameter-name"
                            label={translator('components.detail.edit.name')}
                            value={name}
                            onBlur={(e) => setName(e.target.value)}
                            className={classes.textField}
                            fullWidth
                        />
                    </Paper>
                </Box>
                <Box marginBottom={2}>
                    <Paper>
                        <TextInput
                            id="parameter-value"
                            label={translator('components.detail.edit.value')}
                            value={value}
                            onBlur={(e) => setValue(e.target.value)}
                            className={classes.textField}
                            fullWidth
                        />
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}

export default observe<IPublicProps>([], EditParameter);
