import React, { useState, useRef, ChangeEvent } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Button, Box } from '@material-ui/core';
import { IScriptSchedule } from 'models/state/scripts.models';
import OrderedList from 'views/common/list/OrderedList';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import ButtonWithContent from 'views/common/input/ButtonWithContent';
import useOutsideClick from 'utils/hooks/useOutsideClick';
import TextInputWithSelect from 'views/common/input/TextInputWithSelect';
import { MOCKED_ENVS } from './mock';

interface IFrequency {
    [key: string]: number;
}

const SCHEDULE_FREQUENCIES: IFrequency = {
    minutes: 1,
    houres: 60,
    days: 1440,
};

export default function EditSchedules({
    schedules: initialSchedules,
}: {
    schedules: IScriptSchedule[];
}) {
    const [schedules, setSchedules] = useState(initialSchedules);
    const [isAddScheduleFormOpen, setIsScheduleLabelFormOpen] = useState(false);
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const schedulesButtonWithContentRef = useRef(null);

    const [newSchedulingEnv, setNewSchedulingEnv] = useState('');
    const [newSchedulingFrequencyFactor, setNewSchedulingFrequencyFactor] = useState<number>(
        SCHEDULE_FREQUENCIES[Object.keys(SCHEDULE_FREQUENCIES)[0]], // first item as default
    );
    const [newSchedulingFrequencyAmount, setNewSchedulingFrequencyAmount] = useState<string>('');

    useOutsideClick({
        ref: schedulesButtonWithContentRef,
        callback: () => {
            if (isAddScheduleFormOpen && !isSelectOpen) {
                setIsScheduleLabelFormOpen(false);
            }
        },
    });

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
            setIsScheduleLabelFormOpen(false);
            console.log({
                environment: newSchedulingEnv,
                frequency: parseInt(newSchedulingFrequencyAmount, 10) * newSchedulingFrequencyFactor,
            });
        }
    };

    return (
        <>
            {schedules.length > 0 ? (
                <OrderedList
                    items={schedules.map((schedule) => ({
                        content: `${schedule.environment} - ${schedule.frequency}`,
                        onDelete: () =>
                            setSchedules(
                                schedules.filter(
                                    (l) =>
                                        l.environment !== schedule.environment
                                            && l.frequency !== schedule.frequency,
                                ),
                            ),
                    }))}
                />
            ) : (
                <Translate msg="No schedules" />
            )}
            {(MOCKED_ENVS && MOCKED_ENVS.length > 0) && (
                <ButtonWithContent
                    buttonText={
                        <Translate msg="scripts.detail.side.schedules.add_button" />
                    }
                    isOpen={isAddScheduleFormOpen}
                    onOpenIntent={() => setIsScheduleLabelFormOpen(true)}
                    onCloseIntent={() => setIsScheduleLabelFormOpen(false)}
                    forwardRef={schedulesButtonWithContentRef}
                >
                    <FormControl variant="filled" fullWidth required size="small">
                        <InputLabel id="new-schedule-choose-env-label">
                            <Translate msg="scripts.detail.side.schedules.add_new.environment.placeholder" />
                        </InputLabel>
                        <Select
                            labelId="new-schedule-choose-env-label"
                            id="new-schedule-choose-env"
                            value={newSchedulingEnv}
                            onChange={handleChangeNewSchedulingEnv}
                            onOpen={() => setIsSelectOpen(true)}
                            onClose={() => setIsSelectOpen(false)}
                        >
                            {MOCKED_ENVS.map((env) => (
                                <MenuItem
                                    key={JSON.stringify(env.name)}
                                    value={env.name}
                                >
                                    {env.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                    <Box textAlign="right">
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
            )}
        </>
    );
}
