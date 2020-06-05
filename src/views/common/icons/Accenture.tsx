import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

function AccentureIcon(props: SvgIconProps) {
    return (
        <SvgIcon viewBox="0 0 36 36" {...props}>
            {/* eslint-disable-next-line max-len */}
            <path d="M6 5v7.341l14.596 5.661L6 23.354V31l25-9.941v-6.118z" />
        </SvgIcon>
    );
}

export default AccentureIcon;
