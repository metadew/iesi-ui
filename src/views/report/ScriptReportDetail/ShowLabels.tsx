import React from 'react';
import OrderedList from 'views/common/list/OrderedList';
import { ILabel } from 'models/state/iesiGeneric.models';

export default function ShowLabels({
    labels,
}: {
    labels: ILabel[];
}) {
    return labels.length > 0 && (
        <OrderedList
            items={labels.map((label) => ({
                content: `${label.name}:${label.value}`,
            }))}
        />
    );
}
