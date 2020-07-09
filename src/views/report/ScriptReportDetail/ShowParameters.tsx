import React from 'react';
import OrderedList from 'views/common/list/OrderedList';
import { IParameter } from 'models/state/iesiGeneric.models';

export default function ShowParameters({
    parameters,
}: {
    parameters: IParameter[];
}) {
    return parameters.length > 0 && (
        <OrderedList
            items={parameters.map((parameter) => ({
                content: `${parameter.name}:${parameter.value}`,
            }))}
        />
    );
}
