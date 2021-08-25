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
    TextField,
} from '@material-ui/core';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import { checkAuthority } from 'state/auth/selectors';
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
    isCreateScriptRoute: boolean;
    securityGroupName: string;
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
    nameTextField: {
        width: '100%',
    },
    conditionTextField: {
        width: '100%',
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

function EditAction({
    onClose,
    action,
    onEdit,
    isCreateScriptRoute,
    securityGroupName,
    state,
}: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const translator = getTranslator(state);
    const [errorStopChecked, setErrorStopChecked] = useState<boolean>(action.errorStop);
    const [errorExpectedChecked, setErrorExpectedChecked] = useState<boolean>(action.errorExpected);
    const [parameters, setParameters] = useState(action.parameters);
    const [description, setDescription] = useState(action.description);
    const [name, setName] = useState(action.name);
    const [condition, setCondition] = useState(action.condition);
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
                <Box
                    paddingX={3}
                    paddingY={1.1}
                    boxSizing="content-box"
                    width={50}
                    className={classnames(classes.tableCell, classes.index)}
                >
                    {formatNumberWithTwoDigits(action.number)}
                </Box>
                <Box
                    paddingX={3}
                    paddingY={1.1}
                    className={classnames(
                        classes.tableCell,
                        classes.actionType,
                    )}
                    width="40%"
                >
                    {action.type}
                </Box>
                <Box
                    paddingX={3}
                    paddingY={1.1}
                    className={classnames(classes.actionName)}
                    width="60%"
                >
                    <TextField
                        id="action-name"
                        label={translator('scripts.detail.edit_action.name')}
                        defaultValue={name}
                        onBlur={(e) => setName(e.target.value)}
                        className={classes.nameTextField}
                        InputProps={{
                            readOnly: !isCreateScriptRoute
                                && !checkAuthority(state, SECURITY_PRIVILEGES.S_SCRIPTS_WRITE, securityGroupName),
                            disableUnderline: !isCreateScriptRoute
                                && !checkAuthority(state, SECURITY_PRIVILEGES.S_SCRIPTS_WRITE, securityGroupName),
                        }}
                    />
                </Box>
            </Box>
            <Box padding={2}>
                <Box marginBottom={2}>
                    <Paper>
                        <TextInput
                            id="action-description"
                            label={translator(
                                'scripts.detail.edit_action.description',
                            )}
                            multiline
                            rows={3}
                            className={classes.descriptionTextField}
                            defaultValue={description}
                            onBlur={(e) => setDescription(e.target.value)}
                            InputProps={{
                                readOnly: !isCreateScriptRoute
                                    && !checkAuthority(state, SECURITY_PRIVILEGES.S_SCRIPTS_WRITE, securityGroupName),
                                disableUnderline: true,
                            }}
                        />
                    </Paper>
                </Box>
                <Box marginBottom={2}>
                    <Paper>
                        <TextInput
                            id="action-condition"
                            label={translator(
                                'scripts.detail.edit_action.condition',
                            )}
                            className={classes.conditionTextField}
                            defaultValue={condition}
                            onBlur={(e) => setCondition(e.target.value)}
                            InputProps={{
                                readOnly: !isCreateScriptRoute
                                    && !checkAuthority(state, SECURITY_PRIVILEGES.S_SCRIPTS_WRITE, securityGroupName),
                                disableUnderline: true,
                            }}
                        />
                    </Paper>
                </Box>
                <Box>
                    {matchingActionType.parameters.map((constantParameter) => {
                        const parameter = parameters.find((p) => p.name === constantParameter.name);
                        return (
                            <ExpandableParameter
                                key={constantParameter.name}
                                state={state}
                                onChange={(value) => {
                                    const index = parameters.findIndex((p) => p.name === constantParameter.name);
                                    const newParameters = [...parameters];
                                    if (index === -1) {
                                        newParameters.push({
                                            name: constantParameter.name,
                                            value,
                                        });
                                    } else {
                                        newParameters[index].value = value;
                                    }
                                    setParameters(newParameters);
                                }}
                                parameter={parameter}
                                constantParameter={constantParameter}
                            />
                        );
                    })}
                </Box>
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    marginTop={2}
                    alignItems="center"
                >
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
                            disabled={!isCreateScriptRoute
                                && !checkAuthority(state, SECURITY_PRIVILEGES.S_SCRIPTS_WRITE, securityGroupName)}
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
                            disabled={!(isCreateScriptRoute
                                || checkAuthority(state, SECURITY_PRIVILEGES.S_SCRIPTS_WRITE, securityGroupName))}
                        />
                    </Box>

                    <Box marginLeft={2}>
                        <ButtonGroup size="small">
                            {isCreateScriptRoute
                                || checkAuthority(state, SECURITY_PRIVILEGES.S_SCRIPTS_WRITE, securityGroupName)
                                ? (
                                    <Button
                                        color="default"
                                        variant="outlined"
                                        onClick={onClose}
                                    >
                                        <Translate msg="scripts.detail.edit_action.footer.cancel" />
                                    </Button>
                                ) : (
                                    <Button
                                        color="default"
                                        variant="outlined"
                                        onClick={onClose}
                                    >
                                        <Translate msg="scripts.detail.edit_action.footer.go_back" />
                                    </Button>
                                )}
                            {isCreateScriptRoute
                                || checkAuthority(state, SECURITY_PRIVILEGES.S_SCRIPTS_WRITE, securityGroupName)
                                ? (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        disableElevation
                                        onClick={updateAction}
                                    >
                                        <Translate msg="scripts.detail.edit_action.footer.save" />
                                    </Button>
                                )
                                : null}
                        </ButtonGroup>
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    function updateAction() {
        onEdit({
            ...action,
            name,
            parameters,
            description,
            condition,
            errorStop: errorStopChecked,
            errorExpected: errorExpectedChecked,
        });
        onClose();
    }
}

export default observe<IPublicProps>([StateChangeNotification.I18N_TRANSLATIONS], EditAction);
