import React from 'react';
import packageJson from '../../../../package.json';

export default function AppVersion() {
    return (
        <>
            {packageJson.version}
        </>
    );
}
