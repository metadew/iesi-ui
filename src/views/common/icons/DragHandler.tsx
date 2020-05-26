import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

function DragHandlerIcon(props: SvgIconProps) {
    return (
        <SvgIcon viewBox="0 0 34 34" {...props}>
            {/* eslint-disable-next-line max-len */}
            <path d="M21 22l-3.5 4-3.5-4h7zm5.321-4.057c.375 0 .679.153.679.343v1.371c0 .19-.304.343-.679.343H8.68c-.376 0-.68-.153-.68-.343v-1.371c0-.19.304-.343.679-.343zm0-3.943c.375 0 .679.153.679.343v1.371c0 .19-.304.343-.679.343H8.68c-.375 0-.679-.153-.679-.343v-1.371c0-.19.304-.343.679-.343zM17.5 8l3.5 4h-7l3.5-4z" />
        </SvgIcon>
    );
}

export default DragHandlerIcon;
