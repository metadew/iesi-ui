import React from 'react';
import { Portal } from '@material-ui/core';
import { LOADER_CONTAINER_ELEMENT_ID } from 'config/dom.config';
import isBoolean from '@snipsonian/core/es/is/isBoolean';
import getOrCreateElementInBodyById from '@snipsonian/react/es/utils/getOrCreateElementInBodyById';
import GenericLoader, { IGenericLoaderProps } from '@snipsonian/react/es/components/waiting/GenericLoader';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import './loader.scss';
import SpinningDots from '../SpinningDots';

// TODO do we need to support other props of the GenericLoader ?
interface IPublicProps extends Pick<IGenericLoaderProps, 'showImmediately'|'useFullScreen'> {
    show: boolean | AsyncStatus;
}

const LOADER_CONTAINER_ELEMENT = getOrCreateElementInBodyById(LOADER_CONTAINER_ELEMENT_ID);

export default function Loader(props: IPublicProps) {
    const { show, showImmediately, useFullScreen } = props;

    const enabled = isBoolean(show)
        ? show as boolean
        : show === AsyncStatus.Busy;

    const LoaderComp = () => (
        <GenericLoader
            show={enabled}
            componentToShowWhileLoading={<SpinningDots />}
            useFullScreen={useFullScreen}
            baseClass="Loader"
            showImmediately={showImmediately}
            timeoutBeforeShowInMillis={0}
            timeoutMinDurationInMillis={400}
        />
    );

    if (useFullScreen) {
        return (
            <Portal container={LOADER_CONTAINER_ELEMENT}>
                <LoaderComp />
            </Portal>
        );
    }

    return <LoaderComp />;
}
