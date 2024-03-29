import React, { ReactElement } from 'react';
import {
    CancelOutlined as DeclinedIcon,
    CheckOutlined as SuccessIcon,
    ErrorOutline as ErrorIcon,
    FiberNewOutlined as NewIcon,
    PlaylistAddCheckOutlined as SubmittedIcon,
    RedoOutlined as SkippedIcon,
    ReportProblemOutlined as WarningIcon,
    TimerOutlined as AcceptedIcon,
} from '@material-ui/icons';
import { ExecutionActionStatus } from 'models/state/executionActionStatus.models';
import { ExecutionRequestStatus } from 'models/state/executionRequestStatus.models';

export enum StatusColors {
    Success = 'SUCCESS',
    SuccessDark = 'SUCCESS_DARK',
    Error = 'ERROR',
    Warning = 'WARNING',
    Unknown = 'UNKNOWN',
    Primary = 'PRIMARY',
}

type TStatusColorsAndIcons = {
    [key in ExecutionActionStatus | ExecutionRequestStatus]: {
        icon: ReactElement;
        color: StatusColors;
    };
};

export const statusColorAndIconMap: TStatusColorsAndIcons = {
    SUCCESS: {
        icon: <SuccessIcon />,
        color: StatusColors.Success,
    },
    ERROR: {
        icon: <ErrorIcon />,
        color: StatusColors.Error,
    },
    WARNING: {
        icon: <WarningIcon />,
        color: StatusColors.Warning,
    },
    STOPPED: {
        icon: <ErrorIcon />,
        color: StatusColors.Error,
    },
    SKIPPED: {
        icon: <SkippedIcon />,
        color: StatusColors.Primary,
    },
    NEW: {
        icon: <NewIcon />,
        color: StatusColors.Primary,
    },
    SUBMITTED: {
        icon: <SubmittedIcon />,
        color: StatusColors.Primary,
    },
    ACCEPTED: {
        icon: <AcceptedIcon />,
        color: StatusColors.Success,
    },
    DECLINED: {
        icon: <DeclinedIcon />,
        color: StatusColors.Error,
    },
    COMPLETED: {
        icon: <SuccessIcon />,
        color: StatusColors.SuccessDark,
    },
    KILLED: {
        icon: <ErrorIcon />,
        color: StatusColors.Error,
    },
    ABORTED: {
        icon: <ErrorIcon />,
        color: StatusColors.Error,
    },
    UNKNOWN: {
        icon: <ErrorIcon />,
        color: StatusColors.Primary,
    },
    RUNNING: {
        icon: <AcceptedIcon />,
        color: StatusColors.Success,
    },
};
