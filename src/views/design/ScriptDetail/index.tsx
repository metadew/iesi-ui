import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@material-ui/core';

function ScriptDetail() {
    const { scriptId } = useParams();

    return (
        <div>
            <Typography variant="h2">{`Script detail: ${scriptId}`}</Typography>
        </div>
    );
}

export default ScriptDetail;
