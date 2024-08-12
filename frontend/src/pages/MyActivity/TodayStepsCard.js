import React from 'react';
import { Box, Card, Typography } from '@mui/material';

const TodayStepsCard = ({ dailySteps }) => {
    const dailyCalories = (dailySteps / 1000) * 50;

    return (
        <Card>
            <Box
                sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: '#007FFF',
                    '&:hover': {
                        bgcolor: '#0066CC',
                    },
                    color: 'white',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h5">오늘의 걸음 수</Typography>
                <Typography variant="h4">{dailySteps.toLocaleString()}</Typography>
                <Typography variant="h6">소모된 칼로리</Typography>
                <Typography variant="h6">{dailyCalories.toFixed(2)} kcal</Typography>
            </Box>
        </Card>
    );
};

export default TodayStepsCard;
