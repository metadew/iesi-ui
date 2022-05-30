import React, { useState, ChangeEvent } from 'react';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Button,
    Box,
    Typography,
    makeStyles,
    ClickAwayListener,
} from '@material-ui/core';
import { IScriptSchedule } from 'models/state/scripts.models';
import OrderedList from 'views/common/list/OrderedList';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import ButtonWithContent from 'views/common/input/ButtonWithContent';
import TextInputWithSelect from 'views/common/input/TextInputWithSelect';
import { observe, IObserveProps } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { getAsyncEnvironments } from 'state/entities/environments/selectors';
import { triggerFetchEnvironments } from 'state/entities/environments/triggers';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import Loader from 'views/common/waiting/Loader';

interface IPublicProps {
    schedules: IScriptSchedule[];
    onChange: (newSchedules: IScriptSchedule[]) => void;
}

interface IFrequency {
    [key: string]: number;
}

interface IPublicProps {
    schedules: IScriptSchedule[];
}

const SCHEDULE_FREQUENCIES: IFrequency = {
    minutes: 1,
    houres: 60,
    days: 1440,
};

const useStyles = makeStyles(({ typography }) => ({
    frequencyGroup: {},
    frequencyLabel: {
        fontWeight: typography.fontWeightBold,
    },
    formControlWithLoader: {
        '& .SpinningDots': {
            fontSize: typography.pxToRem(4),
        },
    },
}));

function EditSchedules({ schedules, onChange, state }: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const [isAddScheduleFormOpen, setIsScheduleLabelFormOpen] = useState(false);
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    const [newSchedulingEnv, setNewSchedulingEnv] = useState('');
    const [newSchedulingFrequencyFactor, setNewSchedulingFrequencyFactor] = useState<number>(
        SCHEDULE_FREQUENCIES[Object.keys(SCHEDULE_FREQUENCIES)[0]], // first item as default
    );
    const [newSchedulingFrequencyAmount, setNewSchedulingFrequencyAmount] = useState<string>('');

    const environments = getAsyncEnvironments(state).data;
    const environmentsAsyncStatus = getAsyncEnvironments(state).fetch.status;

    const handleClickAway = () => {
        if (isAddScheduleFormOpen && !isSelectOpen) {
            setIsScheduleLabelFormOpen(false);
        }
    };

    const handleChangeNewSchedulingEnv = (event: ChangeEvent<{ value: unknown }>) => {
        setNewSchedulingEnv(event.target.value as string);
        setIsSelectOpen(false);
    };

    const handleChangeNewSchedulingFrequencyFactor = (event: ChangeEvent<{ value: unknown }>) => {
        setNewSchedulingFrequencyFactor(event.target.value as number);
        setIsSelectOpen(false);
    };

    const handleChangeNewSchedulingFrequencyAmount = (event: ChangeEvent<{ value: unknown }>) => {
        setNewSchedulingFrequencyAmount(event.target.value as string);
    };

    const handleSubmit = () => {
        if (newSchedulingEnv !== '' && newSchedulingFrequencyAmount !== '') {
            onChange([
                ...schedules,
                {
                    environment: newSchedulingEnv,
                    frequency: parseInt(newSchedulingFrequencyAmount, 10) * newSchedulingFrequencyFactor,
                },
            ]);
            setIsScheduleLabelFormOpen(false);
        }
    };

    return (
        <>
            {schedules.length > 0 ? (
                <OrderedList
                    items={schedules.map((schedule) => ({
                        content: `${schedule.environment} - ${schedule.frequency}`,
                        onDelete: () =>
                            onChange(
                                schedules.filter(
                                    (l) =>
                                        l.environment !== schedule.environment
                                            && l.frequency !== schedule.frequency,
                                ),
                            ),
                    }))}
                />
            ) : (
                <Translate msg="scripts.detail.side.schedules.empty" />
            )}
            <ClickAwayListener onClickAway={handleClickAway}>
                <div>
                    <ButtonWithContent
                        buttonText={
                            <Translate msg="scripts.detail.side.schedules.add_button" />
                        }
                        isOpen={isAddScheduleFormOpen}
                        onOpenIntent={onOpenAddScheduling}
                        onCloseIntent={() => setIsScheduleLabelFormOpen(false)}
                    >
                        <FormControl
                            variant="filled"
                            fullWidth
                            required
                            size="small"
                            margin="dense"
                            className={classes.formControlWithLoader}
                        >
                            <Loader show={environmentsAsyncStatus === AsyncStatus.Busy} />
                            <InputLabel id="new-schedule-choose-env-label">
                                <Translate msg="scripts.detail.side.schedules.add_new.environment.placeholder" />
                            </InputLabel>
                            <Select
                                labelId="new-schedule-choose-env-label"
                                id="new-schedule-choose-env"
                                disableUnderline
                                value={newSchedulingEnv}
                                onChange={handleChangeNewSchedulingEnv}
                                onOpen={() => setIsSelectOpen(true)}
                                onClose={() => setIsSelectOpen(false)}
                            >
                                {environments.environments && environments.environments.map((env) => (
                                    <MenuItem
                                        key={JSON.stringify(env.name)}
                                        value={env.name}
                                    >
                                        {env.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box display="flex" alignItems="center">
                            <Typography variant="body2" className={classes.frequencyLabel}>
                                <Translate msg="Script runs every" />
                            </Typography>
                            <TextInputWithSelect
                                inputProps={{
                                    id: 'new-schedule-choose-frequency-number',
                                    placeholder: 'Amount TODO',
                                    'aria-label': 'new schedule frequency',
                                    type: 'number',
                                    inputProps: {
                                        min: 0,
                                    },
                                    value: newSchedulingFrequencyAmount,
                                    onChange: handleChangeNewSchedulingFrequencyAmount,
                                }}
                                selectProps={{
                                    id: 'new-schedule-choose-frequency-factor',
                                    onOpen: () => setIsSelectOpen(true),
                                    onClose: () => setIsSelectOpen(false),
                                    onChange: handleChangeNewSchedulingFrequencyFactor,
                                    value: newSchedulingFrequencyFactor,
                                }}
                                selectOptions={Object.keys(SCHEDULE_FREQUENCIES).map((key) => ({
                                    value: SCHEDULE_FREQUENCIES[key],
                                    displayValue: key,
                                }))}
                            />
                        </Box>
                        <Box textAlign="right" marginTop={1}>
                            <Button
                                variant="contained"
                                color="secondary"
                                disableElevation
                                onClick={handleSubmit}
                            >
                                <Translate msg="add" />
                            </Button>
                        </Box>
                    </ButtonWithContent>
                </div>
            </ClickAwayListener>
        </>
    );

    function onOpenAddScheduling() {
        setIsScheduleLabelFormOpen(true);
        triggerFetchEnvironments();
    }
}

export default observe<IPublicProps>([
    StateChangeNotification.ENVIRONMENTS,
], EditSchedules);
