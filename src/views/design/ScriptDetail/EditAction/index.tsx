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
import { SECURITY_PRIVILEGES, checkAuthority } from 'views/appShell/AppLogIn/components/AuthorithiesChecker';
import { IConstantParameter, IActionType } from 'models/state/constants.models';
import { ChevronRightRounded } from '@material-ui/icons';
import { redirectTo, ROUTE_KEYS } from 'views/routes';
import { IParameter } from 'models/state/iesiGeneric.models';
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
        marginTop: 0,
        '& .MuiFilledInput-root': {
            background: palette.background.paper,
        },
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
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'end',
        color: palette.grey[500],
        fontSize: '.7rem',
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
    const orderedActionTypeParameters = orderActionTypeParameters(matchingActionType.parameters, matchingActionType);
    return (
        <Box className={classes.dialog}>
            <Box
                className={classes.header}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding={2}
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
                    className={classnames(classes.actionType)}
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
                    {
                        matchingActionType.type === 'fwk.executeScript'
                        && (
                            <Box paddingX={2} className={classes.buttonContainer}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    disabled={
                                        !(getScriptNameOrValue(parameters, 'script').value.length
                                            && getScriptNameOrValue(parameters, 'version').value.length)
                                    }
                                    size="small"
                                    endIcon={<ChevronRightRounded />}
                                    onClick={
                                        getScriptNameOrValue(parameters, 'script')
                                            && getScriptNameOrValue(parameters, 'version')
                                            ? () => redirectTo({
                                                routeKey: ROUTE_KEYS.R_SCRIPT_DETAIL,
                                                params: {
                                                    name: getScriptNameOrValue(parameters, 'script').value || '',
                                                    version: getScriptNameOrValue(parameters, 'version').value || '',
                                                },
                                            })
                                            : null
                                    }
                                >
                                    <Translate msg="script_reports.detail.main.action.go_to_script" />
                                </Button>
                                {
                                    !(getScriptNameOrValue(parameters, 'script').value.length
                                    && getScriptNameOrValue(parameters, 'version').value.length)
                                    && (
                                        <Translate msg="Script name and version are required to see the script" />
                                    )
                                }
                            </Box>
                        )
                    }
                </Box>
            </Box>
            <Box padding={2}>
                <Box marginBottom={2}>
                    <Paper>
                        <TextInput
                            id="action-name"
                            label={translator('scripts.detail.edit_action.name')}
                            defaultValue={name}
                            onBlur={(e) => setName(e.target.value)}
                            className={classes.nameTextField}
                            InputProps={{
                                readOnly: !isCreateScriptRoute
                                    && !checkAuthority(SECURITY_PRIVILEGES.S_SCRIPTS_WRITE, securityGroupName),
                                disableUnderline: true,
                            }}
                        />
                    </Paper>
                </Box>
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
                                    && !checkAuthority(SECURITY_PRIVILEGES.S_SCRIPTS_WRITE, securityGroupName),
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
                                    && !checkAuthority(SECURITY_PRIVILEGES.S_SCRIPTS_WRITE, securityGroupName),
                                disableUnderline: true,
                            }}
                        />
                    </Paper>
                </Box>
                <Box>
                    {orderedActionTypeParameters.map((constantParameter) => {
                        const parameter = parameters.find((p) => p.name === constantParameter.name);
                        return (
                            <ExpandableParameter
                                key={constantParameter.name}
                                onChange={(value) => {
                                    const index = parameters
                                        .findIndex((p) => p.name === constantParameter.name);
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
                                && !checkAuthority(SECURITY_PRIVILEGES.S_SCRIPTS_WRITE, securityGroupName)}
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
                                || checkAuthority(SECURITY_PRIVILEGES.S_SCRIPTS_WRITE, securityGroupName))}
                        />
                    </Box>

                    <Box marginLeft={2}>
                        <ButtonGroup size="small">
                            {isCreateScriptRoute
                                || checkAuthority(SECURITY_PRIVILEGES.S_SCRIPTS_WRITE, securityGroupName)
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
                                || checkAuthority(SECURITY_PRIVILEGES.S_SCRIPTS_WRITE, securityGroupName)
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

    function orderActionTypeParameters(items: IConstantParameter[], actionType: IActionType) {
        const constantParameters = items
            ? items
                .map((constantParameter) => ({
                    name: constantParameter.name,
                    description: constantParameter.description,
                    type: constantParameter.type,
                    mandatory: actionType
                        ? actionType.parameters
                            .some((type) => type.name === constantParameter.name && type.mandatory === true)
                        : false,
                    encrypted: constantParameter.encrypted,
                }))
            : [];
        const mandatoryParameters: IConstantParameter[] = constantParameters
            .filter((p) => p.mandatory)
            .sort((a, b) => a.name.toLowerCase().localeCompare(b.name));
        const nonMandatoryParameters: IConstantParameter[] = constantParameters
            .filter((p) => !p.mandatory)
            .sort((a, b) => a.name.toLowerCase().localeCompare(b.name));
        const orderedParameters: IConstantParameter[] = mandatoryParameters
            .concat(nonMandatoryParameters)
            .map((p) => ({
                name: p.name,
                description: p.description,
                type: p.type,
                mandatory: p.mandatory,
                encrypted: p.encrypted,
            }));
        return orderedParameters;
    }

    function getScriptNameOrValue(actionParameters: IParameter[], param: string) {
        const nameOrValue = actionParameters.find((parameter) => parameter.name === param);
        return nameOrValue || { name: '', value: '' };
    }
}

export default observe<IPublicProps>([StateChangeNotification.I18N_TRANSLATIONS], EditAction);
