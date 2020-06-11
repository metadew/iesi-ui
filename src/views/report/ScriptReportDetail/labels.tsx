import React, { useState } from 'react';
import { ILabel } from 'models/state/iesiGeneric.models';
import OrderedList from 'views/common/list/OrderedList';
import Translate from '@snipsonian/react/es/components/i18n/Translate';

export default function ShowLabels({ labels: initialLabels }: {
    labels: ILabel[];
}) {
    const [labels] = useState(initialLabels);

    return (
        <>
            {labels.length > 0 ? (
                <OrderedList
                    items={labels.map((label) => ({
                        content: label.value,
                    }))}
                />
            ) : (
                <Translate msg="scripts.detail.side.labels.empty" />
            )}
        </>
    );
}
