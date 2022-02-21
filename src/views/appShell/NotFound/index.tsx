import React from 'react';
import { styled } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import Robot from './robot.png';

const MyTypography = styled(Typography)({
    color: '#29ABE2',
    fontSize: 150,
    fontWeight: 800,
});
const MyTypography2 = styled(Typography)({
    fontSize: 70,
    marginTop: -50,
    fontWeight: 700,
});

export default function NotFound() {
    return (
        <div>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <img src={Robot} alt="robot not-found" height={500} />
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                >
                    <MyTypography>404</MyTypography>
                    <MyTypography2>Not Found</MyTypography2>
                    <Typography variant="h6">
                        Oops...the page you&apos;re trying to reach doesn&apos;t exist.
                    </Typography>
                </Box>
            </Box>
        </div>
    );
}
