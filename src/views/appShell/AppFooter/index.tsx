import React from 'react';
import AppVersion from './AppVersion';

const CLASS_NAME = 'AppFooter';

export default function AppFooter() {
    return (
        <div className={CLASS_NAME}>
            <AppVersion />
        </div>
    );
}
