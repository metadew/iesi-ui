import {
    ITemplateMatcher,
    ITemplateMatcherValue,
} from 'models/state/templates.model';
import { IObserveProps, observe } from 'views/observe';
import {
    Box,
    Button,
    ButtonGroup,
    darken,
    FormControl,
    FormControlLabel,
    FormLabel,
    makeStyles,
    Paper,
    Radio,
    RadioGroup,
    Typography,
} from '@material-ui/core';
import { THEME_COLORS } from 'config/themes/colors';
import { getTranslator } from 'state/i18n/selectors';
import React, { useState } from 'react';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import TextInput from 'views/common/input/TextInput';
import { checkAuthority } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';

const useStyles = makeStyles(({ palette, typography }) => ({
    dialog: {
        background: palette.background.default,
    },
    header: {
        background: palette.background.paper,
    },
    index: {
        fontWeight: typography.fontWeightBold,
        textAlign: 'center',
    },
    textField: {
        marginTop: 0,
        '& .MuiFilledInput-root': {
            background: palette.background.paper,
        },
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
    paper: {
        padding: 8,
    },
    keyInput: {
        marginRight: 4,
    },
    valueInput: {
        marginLeft: 4,
    },
    addButton: {
        backgroundColor: palette.type === 'light'
            ? THEME_COLORS.GREY_LIGHT
            : darken(THEME_COLORS.GREY_DARK, 0.2),
    },
    matcherRadioGroup: {
        display: 'flex',
        flexDirection: 'row',
    },
}));

interface IPublicProps {
    onClose: () => void;
    onEdit: (matcher: ITemplateMatcher) => void;
    matcher?: ITemplateMatcher;
}

function EditMatcher({
    state,
    matcher,
    onClose,
    onEdit,
}: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const translator = getTranslator(state);
    const [matcherKey, setMatcherKey] = useState(matcher ? matcher.key : '');
    const [matcherValue, setMatcherValue] = useState({
        type: matcher ? matcher.matcherValue.type : 'any',
        value: matcher && matcher.matcherValue.type === 'fixed'
            ? matcher.matcherValue.value
            : '',
        templateName: matcher && matcher.matcherValue.type === 'template'
            ? matcher.matcherValue.templateName
            : '',
        templateVersion: matcher && matcher.matcherValue.type === 'template'
            ? matcher.matcherValue.templateVersion
            : '',
    });

    const handleEdit = () => {
        const matcherValueFiltered = Object.fromEntries(
            // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
            Object.entries(matcherValue).filter(([_, objectValue]) => objectValue.length > 0),
        ) as unknown;

        onEdit({
            key: matcherKey,
            matcherValue: matcherValueFiltered as ITemplateMatcherValue,
        });
    };

    console.log('MATCHER: ', matcher);

    return (
        <Box className={classes.dialog}>
            <Box
                className={classes.header}
                display="flex"
                justifyContent="center"
                alignItems="center"
                padding={2}
            >
                <Typography variant="h2">
                    <Translate msg="templates.detail.edit.matcher.title_create" />
                </Typography>
            </Box>
            <Box padding={2}>
                <Box marginBottom={2}>
                    <Paper className={classes.paper}>
                        <TextInput
                            variant="standard"
                            label="Matcher key"
                            InputProps={{
                                disableUnderline: true,
                                autoComplete: 'off',
                            }}
                            value={matcherKey}
                            onChange={(e) => setMatcherKey(e.target.value)}
                            helperText={matcherKey.length > 300
                                && translator('templates.detail.edit.matcher.empty_key_error')}
                            error={false}
                            className={classes.textField}
                            fullWidth
                            autoFocus
                            required
                        />
                    </Paper>
                </Box>
                <Box marginBottom={2}>
                    <FormControl>
                        <FormLabel>Matcher type</FormLabel>
                        <RadioGroup
                            className={classes.matcherRadioGroup}
                            value={matcherValue.type}
                            onChange={(e) => {
                                setMatcherValue({
                                    type: e.target.value,
                                    value: '',
                                    templateName: '',
                                    templateVersion: '',
                                });
                            }}
                        >
                            <FormControlLabel control={<Radio />} label="Any" value="any" />
                            <FormControlLabel control={<Radio />} label="Fixed" value="fixed" />
                            <FormControlLabel control={<Radio />} label="Template" value="template" />
                        </RadioGroup>
                    </FormControl>
                </Box>

                {
                    matcherValue.type === 'fixed' && (
                        <Box marginBottom={2}>
                            <Paper className={classes.paper}>
                                <TextInput
                                    variant="standard"
                                    label="Fixed value"
                                    InputProps={{
                                        disableUnderline: true,
                                        autoComplete: 'off',
                                    }}
                                    className={classes.textField}
                                    value={matcherValue.value}
                                    onChange={(e) => setMatcherValue({
                                        ...matcherValue,
                                        value: e.target.value,
                                    })}
                                    fullWidth
                                    required
                                />
                            </Paper>
                        </Box>

                    )
                }
                {
                    matcherValue.type === 'template' && (
                        <>
                            <Box marginBottom={2}>
                                <Paper className={classes.paper}>
                                    <TextInput
                                        variant="standard"
                                        label="Template name"
                                        InputProps={{
                                            disableUnderline: true,
                                            autoComplete: 'off',
                                        }}
                                        className={classes.textField}
                                        value={matcherValue.templateName}
                                        onChange={(e) => setMatcherValue({
                                            ...matcherValue,
                                            templateName: e.target.value,
                                        })}
                                        fullWidth
                                        required
                                    />
                                </Paper>
                            </Box>
                            <Box marginBottom={2}>
                                <Paper className={classes.paper}>
                                    <TextInput
                                        variant="standard"
                                        label="Template version"
                                        InputProps={{
                                            disableUnderline: true,
                                            autoComplete: 'off',
                                        }}
                                        className={classes.textField}
                                        value={matcherValue.templateVersion}
                                        onChange={(e) => setMatcherValue({
                                            ...matcherValue,
                                            templateVersion: e.target.value,
                                        })}
                                        fullWidth
                                        required
                                    />
                                </Paper>
                            </Box>

                        </>
                    )
                }
                <Box marginTop={3} textAlign="right">
                    <ButtonGroup size="small">
                        <Button
                            variant="outlined"
                            color="default"
                            onClick={onClose}
                            disableElevation
                        >
                            <Translate msg="templates.detail.edit.matcher.footer.cancel" />
                        </Button>
                        {
                            checkAuthority(state, SECURITY_PRIVILEGES.S_TEMPLATES_WRITE) && (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleEdit()}
                                    disableElevation
                                >
                                    <Translate msg="templates.detail.edit.matcher.footer.save" />
                                </Button>
                            )
                        }
                    </ButtonGroup>

                </Box>
            </Box>
        </Box>
    );
}

export default observe<IPublicProps>([], EditMatcher);
