import React, { useState } from 'react';
import classnames from 'classnames';
import { THEME_COLORS } from 'config/themes/colors';
import {
    Box,
    makeStyles,
    Typography,
    Checkbox,
    Button,
    ButtonGroup,
    Paper,
} from '@material-ui/core';
import { IScriptAction } from 'models/state/scripts.models';
import { formatNumberWithTwoDigits } from 'utils/number/format';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import TextInput from 'views/common/input/TextInput';
import { IObserveProps, observe } from 'views/observe';
import { getAsyncActionTypes } from 'state/entities/constants/selectors';
import { getTranslator } from 'state/i18n/selectors';
import { StateChangeNotification } from 'models/state.models';
import ExpandableParameter from './ExpandableParameter';

interface IPublicProps {
    action: IScriptAction;
    onClose: () => void;
    onEdit: (action: IScriptAction) => void;
}

const useStyles = makeStyles(({ palette, spacing, typography }) => ({
    dialog: {
        background: palette.background.default,
    },
    header: {
        background: palette.background.paper,
    },
    headerAction: {
        margin: '2px 0',
    },
    column: {
        padding: `${spacing(1.1)}px ${spacing(3)}px`,
    },
    index: {
        fontWeight: typography.fontWeightBold,
        textAlign: 'center',
    },
    actionName: {
        fontWeight: typography.fontWeightBold,
    },
    actionType: {
        color: palette.primary.main,
        fontWeight: typography.fontWeightBold,
    },
    descriptionTextField: {
        marginTop: 0,
        '& .MuiFilledInput-root': {
            background: palette.background.paper,
        },
    },
    footerAction: {
        fontSize: '.8rem',
        fontWeight: typography.fontWeightBold,
    },
    tableCell: {
        position: 'relative',
        '&:after': {
            content: '" "',
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: '1px',
            backgroundColor: THEME_COLORS.GREY,
        },
    },
}));

function EditAction({ onClose, action, onEdit, state }: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const translator = getTranslator(state);
    const [errorStopChecked, setErrorStopChecked] = useState<boolean>(action.errorStop);
    const [errorExpectedChecked, setErrorExpectedChecked] = useState<boolean>(action.errorExpected);
    const [parameters, setParameters] = useState(action.parameters);
    const [description, setDescription] = useState(action.description);

    const actionTypes = getAsyncActionTypes(state).data || [];
    const matchingActionType = actionTypes.find((item) => action.type === item.type);

    return (
        <Box className={classes.dialog}>
            <Box
                className={classes.header}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding={1}
            >
                {/* eslint-disable-next-line max-len */}
                <Box paddingX={3} paddingY={1.1} boxSizing="content-box" width={50} className={classnames(classes.tableCell, classes.index)}>
                    {formatNumberWithTwoDigits(action.number)}
                </Box>
                {/* eslint-disable-next-line max-len */}
                <Box paddingX={3} paddingY={1.1} className={classnames(classes.tableCell, classes.actionType)} width="40%">
                    {action.type}
                </Box>
                {/* eslint-disable-next-line max-len */}
                <Box paddingX={3} paddingY={1.1} className={classnames(classes.actionName)} width="60%">
                    {action.name}
                </Box>
            </Box>
            <Box padding={2}>
                <Box marginBottom={2}>
                    <Paper>
                        <TextInput
                            id="action-description"
                            label={translator('scripts.detail.edit_action.description')}
                            multiline
                            rows={3}
                            className={classes.descriptionTextField}
                            defaultValue={description}
                            onBlur={(e) => setDescription(e.target.value)}
                        />
                    </Paper>
                </Box>
                <Box maxHeight={400} overflow="scroll">
                    {parameters.map((parameter) => {
                        // eslint-disable-next-line max-len
                        const constantParameter = matchingActionType.parameters.find((item) => item.name === parameter.name);
                        return (
                            <ExpandableParameter
                                key={parameter.name}
                                onChange={(value) => {
                                    const newParameters = parameters.map((item) => {
                                        if (item.name === parameter.name) {
                                            return {
                                                ...item,
                                                value,
                                            };
                                        }
                                        return item;
                                    });

                                    setParameters(newParameters);
                                }}
                                parameter={parameter}
                                constantParameter={constantParameter}
                            />
                        );
                    })}
                </Box>
                <Box display="flex" justifyContent="flex-end" marginTop={2} alignItems="center">
                    <Box display="flex" alignItems="center">
                        <Typography className={classes.footerAction}>
                            <Translate msg="scripts.detail.edit_action.footer.continue_on_fail" />
                        </Typography>
                        <Checkbox
                            edge="end"
                            checked={!errorStopChecked}
                            onChange={() => {
                                setErrorStopChecked(!errorStopChecked);
                            }}
                        />
                    </Box>
                    <Box display="flex" alignItems="center" marginLeft={2}>
                        <Typography className={classes.footerAction}>
                            <Translate msg="scripts.detail.edit_action.footer.expected_to_fail" />
                        </Typography>
                        <Checkbox
                            edge="end"
                            checked={errorExpectedChecked}
                            onChange={() => {
                                setErrorExpectedChecked(!errorExpectedChecked);
                            }}
                        />
                    </Box>

                    <Box marginLeft={2}>
                        <ButtonGroup color="primary" size="small">
                            <Button onClick={onClose}>
                                <Translate msg="scripts.detail.edit_action.footer.cancel" />
                            </Button>
                            <Button onClick={updateAction}>
                                <Translate msg="scripts.detail.edit_action.footer.save" />
                            </Button>
                        </ButtonGroup>
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    function updateAction() {
        onEdit({
            ...action,
            parameters,
            description,
            errorStop: errorStopChecked,
            errorExpected: errorExpectedChecked,
        });

        onClose();
    }
}

export default observe<IPublicProps>([StateChangeNotification.I18N_TRANSLATIONS], EditAction);
