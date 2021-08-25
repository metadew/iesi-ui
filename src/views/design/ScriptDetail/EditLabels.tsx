import React, { useState } from 'react';
import { ClickAwayListener, Box, Button, Typography } from '@material-ui/core';
import { getTranslator } from 'state/i18n/selectors';
import { ILabel } from 'models/state/iesiGeneric.models';
import OrderedList from 'views/common/list/OrderedList';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import ButtonWithContent from 'views/common/input/ButtonWithContent';
import TextInput from 'views/common/input/TextInput';
import { observe, IObserveProps } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { checkAuthority } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';

interface IPublicProps {
    labels: ILabel[];
    onChange: (newLabels: ILabel[]) => void;
    securityGroupName: string;
    isCreateScriptRoute: boolean;
}

function EditLabels({
    labels,
    onChange,
    securityGroupName,
    isCreateScriptRoute,
    state,
}: IPublicProps & IObserveProps) {
    const [isAddLabelFormOpen, setIsAddLabelFormOpen] = useState(false);
    const [newLabelName, setNewLabelName] = useState('');
    const [newLabelValue, setNewLabelValue] = useState('');
    const [hasSubmitErrors, setHasSubmitErrors] = useState(false);

    const translator = getTranslator(state);

    const handleClickAway = () => {
        setIsAddLabelFormOpen(false);
    };

    const handleSubmit = () => {
        if (newLabelName !== '' && newLabelValue !== '') {
            onChange([...labels, { name: newLabelName, value: newLabelValue }]);
            setIsAddLabelFormOpen(false);
            setHasSubmitErrors(false);
        } else {
            setHasSubmitErrors(true);
        }
    };

    return (
        <>
            {labels.length > 0
                ? (
                    <OrderedList
                        items={labels.map((label) => ({
                            content: `${label.name}:${label.value}`,
                            onDelete: isCreateScriptRoute || checkAuthority(
                                state,
                                SECURITY_PRIVILEGES.S_SCRIPTS_WRITE,
                                securityGroupName,
                            )
                                ? () => onChange(labels.filter((l) => l.name !== label.name))
                                : null,
                        }))}
                    />
                ) : (
                    <Typography variant="body2">
                        <Translate msg="scripts.detail.side.labels.empty" />
                    </Typography>
                )}
            <ClickAwayListener onClickAway={handleClickAway}>
                <div>
                    {isCreateScriptRoute || checkAuthority(
                        state,
                        SECURITY_PRIVILEGES.S_SCRIPTS_WRITE,
                        securityGroupName,
                    )
                        ? (
                            <ButtonWithContent
                                buttonText={<Translate msg="scripts.detail.side.labels.add_button" />}
                                isOpen={isAddLabelFormOpen}
                                onOpenIntent={() => setIsAddLabelFormOpen(true)}
                                onCloseIntent={() => setIsAddLabelFormOpen(false)}
                            >

                                <TextInput
                                    id="new-label-name"
                                    label={translator('scripts.detail.side.labels.add_new.name')}
                                    required
                                    error={hasSubmitErrors && newLabelName === ''}
                                    value={newLabelName}
                                    onChange={(e) => setNewLabelName(e.target.value)}
                                />
                                <TextInput
                                    id="new-label-value"
                                    label={translator('scripts.detail.side.labels.add_new.value')}
                                    required
                                    error={hasSubmitErrors && newLabelValue === ''}
                                    value={newLabelValue}
                                    onChange={(e) => setNewLabelValue(e.target.value)}
                                />
                                <Box textAlign="right" marginTop={0.5}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        disableElevation
                                        onClick={handleSubmit}
                                    >
                                        <Translate msg="scripts.detail.side.labels.add_new.button" />
                                    </Button>
                                </Box>
                            </ButtonWithContent>
                        ) : null }
                </div>
            </ClickAwayListener>
        </>
    );
}

export default observe<IPublicProps>([StateChangeNotification.I18N_TRANSLATIONS], EditLabels);
