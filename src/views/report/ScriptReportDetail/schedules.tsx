import React, { useState } from 'react';
import { IScriptSchedule } from 'models/state/scripts.models';
import OrderedList from 'views/common/list/OrderedList';
import Translate from '@snipsonian/react/es/components/i18n/Translate';

export default function ShowSchedules({
    schedules: initialSchedules,
}: {
    schedules: IScriptSchedule[];
}) {
    const [schedules] = useState(initialSchedules);

    return (
        <>
            {schedules.length > 0 ? (
                <OrderedList
                    items={schedules.map((schedule) => ({
                        content: `${schedule.environment} - ${schedule.frequency}`,
                    }))}
                />
            ) : (
                <Translate msg="No schedules" />
            )}
        </>
    );
}
