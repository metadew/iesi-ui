import React from 'react';
import classNames from 'classnames';
import { makeStyles, Box } from '@material-ui/core';
import { StatusColors, statusColorAndIconMap } from 'config/statusColorsAndIcons.config';
import { ExecutionActionStatus } from 'models/state/scriptExecutions.models';
import { ExecutionRequestStatus } from 'models/state/executionRequests.models';
import Tooltip from 'views/common/tooltips/Tooltip';

interface IPublicProps {
    label?: string;
    status: ExecutionActionStatus | ExecutionRequestStatus;
    tooltipLabel?: string;
}

const useStyles = makeStyles(({ palette }) => ({
    statusIcon: {
        '& > .MuiSvgIcon-root': {
            fontSize: '1.4em',
        },
    },
    statusSuccess: {
        color: palette.success.main,
    },
    statusSuccessDark: {
        color: palette.success.dark,
    },
    statusWarning: {
        color: palette.warning.main,
    },
    statusError: {
        color: palette.error.main,
    },
    statusPrimary: {
        color: palette.primary.main,
    },
}));


export default function StatusIcon({
    label,
    status,
    tooltipLabel,
}: IPublicProps) {
    const classes = useStyles();
    const currentStatus = statusColorAndIconMap[status];

    return (
        <Box
            display="flex"
            alignItems="center"
        >
            {currentStatus && (
                <Box
                    flex="0 0 auto"
                    className={classNames(classes.statusIcon, {
                        [classes.statusSuccessDark]: currentStatus.color === StatusColors.SuccessDark,
                        [classes.statusSuccess]: currentStatus.color === StatusColors.Success,
                        [classes.statusWarning]: currentStatus.color === StatusColors.Warning,
                        [classes.statusError]: currentStatus.color === StatusColors.Error,
                        [classes.statusPrimary]: currentStatus.color === StatusColors.Primary,
                    })}
                >
                    {tooltipLabel ? (
                        <Tooltip title={tooltipLabel} enterDelay={1000} enterNextDelay={1000}>
                            {currentStatus.icon}
                        </Tooltip>
                    ) : currentStatus.icon}
                </Box>
            )}
            {label && <Box flex="1 1 auto" paddingLeft={currentStatus ? 0.5 : 0}>{label}</Box>}
        </Box>
    );
}
