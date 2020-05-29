import React, { useState, useRef } from 'react';
import { IScriptSchedule } from 'models/state/scripts.models';
import OrderedList from 'views/common/list/OrderedList';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import ButtonWithContent from 'views/common/input/ButtonWithContent';
import useOutsideClick from 'utils/hooks/useOutsideClick';

export default function EditSchedules({
    schedules: initialSchedules,
}: {
    schedules: IScriptSchedule[];
}) {
    const [schedules, setSchedules] = useState(initialSchedules);
    const [isAddScheduleFormOpen, setIsScheduleLabelFormOpen] = useState(false);
    const schedulesButtonWithContentRef = useRef(null);

    useOutsideClick({
        ref: schedulesButtonWithContentRef,
        callback: () => {
            if (isAddScheduleFormOpen) {
                setIsScheduleLabelFormOpen(false);
            }
        },
    });

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
                                        l.environment !== schedule.environment && l.frequency !== schedule.frequency,
                                ),
                            ),
                    }))}
                />
            ) : (
                <Translate msg="No schedules" />
            )}
            <ButtonWithContent
                buttonText={
                    <Translate msg="scripts.detail.side.schedules.add_button" />
                }
                isOpen={isAddScheduleFormOpen}
                onOpenIntent={() => setIsScheduleLabelFormOpen(true)}
                onCloseIntent={() => setIsScheduleLabelFormOpen(false)}
                forwardRef={schedulesButtonWithContentRef}
            >
                TODO - FORM
                {/* <TextInputWithButton
                    inputProps={{
                        id: 'new-schedule',
                        placeholder: 'DEV TO DO',
                        'aria-label': 'New schedule',
                    }}
                    buttonText={
                        <Translate msg="scripts.detail.side.schedules.add_new.button" />
                    }
                    onSubmit={(value) => {
                        setIsScheduleLabelFormOpen(false);
                    }}
                /> */}
            </ButtonWithContent>
        </>
    );
}
