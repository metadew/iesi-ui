import React from 'react';
import { Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';

function ReportDetail() {
    const { detailId } = useParams();

    return (
        <div>
            <Typography variant="h2">{`Execution detail: ${detailId}`}</Typography>
        </div>
    );
}

export default ReportDetail;
