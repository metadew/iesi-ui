import React from 'react';
import { observe } from 'views/observe';

interface IPublicProps {
    open: boolean;
    onClose: () => void;
    onOpen: () => void;
}

function EditConnectionDialog() {
    // TODO IMPLEMENT COLUMN UPDATES
    return <></>;
}

export default observe<IPublicProps>([], EditConnectionDialog);
