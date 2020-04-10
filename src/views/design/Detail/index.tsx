import React from 'react';
import { Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';

function ScriptDetail() {
    const { detailId } = useParams();

    return (
        <div>
            <Typography variant="h2">{`Script detail: ${detailId}`}</Typography>
        </div>
    );
}

export default ScriptDetail;
