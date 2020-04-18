import React from 'react';
import { Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';

function ScriptReportDetail() {
    const { reportId } = useParams();

    return (
        <div>
            <Typography variant="h2">{`Execution detail: ${reportId}`}</Typography>
        </div>
    );
}

export default ScriptReportDetail;
