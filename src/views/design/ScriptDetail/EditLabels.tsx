import React, { useState, useRef } from 'react';
import { ILabel } from 'models/state/iesiGeneric.models';
import OrderedList from 'views/common/list/OrderedList';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import ButtonWithContent from 'views/common/input/ButtonWithContent';
import TextInputWithButton from 'views/common/input/TextInputWithButton';
import useOutsideClick from 'utils/hooks/useOutsideClick';

export default function EditLabels({ labels: initialLabels }: {
    labels: ILabel[];
}) {
    const [labels, setLabels] = useState(initialLabels);
    const [isAddLabelFormOpen, setIsAddLabelFormOpen] = useState(false);
    const labelsButtonWithContentRef = useRef(null);

    useOutsideClick({
        ref: labelsButtonWithContentRef,
        callback: () => {
            if (isAddLabelFormOpen) {
                setIsAddLabelFormOpen(false);
            }
        },
    });

    return (
        <>
            {labels.length > 0 ? (
                <OrderedList
                    items={labels.map((label) => ({
                        content: label.value,
                        onDelete: () => setLabels(labels.filter((l) => l.name !== label.name)),
                    }))}
                />
            ) : (
                <Translate msg="scripts.detail.side.labels.empty" />
            )}
            <ButtonWithContent
                buttonText={<Translate msg="scripts.detail.side.labels.add_button" />}
                isOpen={isAddLabelFormOpen}
                onOpenIntent={() => setIsAddLabelFormOpen(true)}
                onCloseIntent={() => setIsAddLabelFormOpen(false)}
                forwardRef={labelsButtonWithContentRef}
            >
                <TextInputWithButton
                    inputProps={{
                        id: 'new-label',
                        placeholder: 'Label TODO',
                        'aria-label': 'new label',
                    }}
                    buttonText={<Translate msg="scripts.detail.side.labels.add_new.button" />}
                    onSubmit={(value) => {
                        if (value) {
                            setLabels([...labels, { name: JSON.stringify(value), value }]);
                        }
                        setIsAddLabelFormOpen(false);
                    }}
                />
            </ButtonWithContent>
        </>
    );
}
