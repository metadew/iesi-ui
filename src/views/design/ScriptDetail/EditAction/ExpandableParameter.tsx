import React from 'react';
import {
    Box,
    makeStyles,
    ExpansionPanel,
    ExpansionPanelSummary,
    Typography,
    ExpansionPanelDetails,
    FormControl,
    InputLabel,
    FilledInput,
    Button,
} from '@material-ui/core';
import {
    ExpandMore,
    ChevronRightRounded,
} from '@material-ui/icons';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { IParameter } from 'models/state/iesiGeneric.models';
import { IConstantParameter } from 'models/state/constants.models';
import { SECURITY_PRIVILEGES, checkAuthorityGeneral } from 'views/appShell/AppLogIn/components/AuthorithiesChecker';
// import { redirectTo, ROUTE_KEYS } from 'views/routes';

const CHILD_SCRIPT_PARAMETER = 'script';

interface IPublicProps {
    onChange: (value: string) => void;
    parameter: IParameter;
    constantParameter: IConstantParameter;
}

const useStyles = makeStyles(({ palette, spacing }) => ({
    expansionPanel: {
        width: '100%',
        margin: '0 !important',
        background: palette.background.paper,
        boxShadow: 'none',
        borderLeft: `1px solid ${palette.grey[300]}`,
        borderRight: `1px solid ${palette.grey[300]}`,
        borderBottom: `1px solid ${palette.grey[300]}`,
        borderLeftColor: palette.grey[300],
        padding: `${spacing(1)}px ${spacing(2)}px`,
        '&:first-child': {
            borderTop: `1px solid ${palette.grey[300]}`,
        },
    },
    expansionPanelTitle: {
        fontSize: '1.25em',
    },
    expansionPanelLabel: {
        fontSize: '.8rem',
        color: palette.grey[500],
    },
    expansionPanelSummary: {
        margin: 0,
        paddingLeft: 0,
        paddingRight: 0,
    },
    expansionPanelDetail: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    button: {
        marginLeft: 385,
    },
}));

export default function ExpandableParameter({ parameter, onChange, constantParameter }: IPublicProps) {
    const classes = useStyles();

    if (!constantParameter) {
        return null;
    }

    console.log(constantParameter);

    return (
        <ExpansionPanel className={classes.expansionPanel}>
            <ExpansionPanelSummary
                expandIcon={<ExpandMore />}
                className={classes.expansionPanelSummary}
            >
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <Typography className={classes.expansionPanelLabel}>
                        {constantParameter.name}
                        {constantParameter.mandatory && <span>&nbsp;*</span>}
                    </Typography>
                    <Typography className={classes.expansionPanelTitle}>
                        {constantParameter.description}
                    </Typography>
                </Box>
                {
                    constantParameter.name === CHILD_SCRIPT_PARAMETER && (
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="secondary"
                            size="small"
                            endIcon={<ChevronRightRounded />}
                            // onClick={() => redirectTo({
                            //     routeKey: ROUTE_KEYS.R_REPORT_DETAIL,
                            //     params: {
                            //         executionRequestId,
                            //         runId: item.data.runId,
                            //         processId: item.data.processId,
                            //     },
                            // })}
                        >
                            <Translate msg="script_reports.detail.main.action.go_to_script_detail" />
                        </Button>
                    )
                }
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.expansionPanelDetail}>
                <FormControl
                    variant="filled"
                    fullWidth
                >
                    <InputLabel htmlFor="filled-adornment-password">
                        <Translate msg="scripts.detail.edit_action.parameter.value" />
                    </InputLabel>
                    <FilledInput
                        id={`${constantParameter.name}-input`}
                        type="text"
                        value={parameter ? parameter.value : ''}
                        onChange={(e) => onChange(e.target.value)}
                        multiline
                        readOnly={!checkAuthorityGeneral(SECURITY_PRIVILEGES.S_SCRIPTS_WRITE)}
                    />
                </FormControl>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}
