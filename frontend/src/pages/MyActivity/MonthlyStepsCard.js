import React from 'react';
import { Box, Card, Typography, LinearProgress } from '@mui/material';

const MonthlyStepsCard = ({ currentWeekData, monthlyGoal }) => {
    const currentWeeklyTotal = currentWeekData.reduce((sum, day) => sum + day.steps, 0);
    const monthlyTotal = currentWeeklyTotal * 4;
    const monthlyProgress = (monthlyTotal / monthlyGoal) * 100;

    return (
        <Card>
            <Box
                sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: '#00C49F',
                    '&:hover': {
                        bgcolor: '#00A676',
                    },
                    color: 'white',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h6">월간 총 걸음 수</Typography>
                <Typography variant="h4">{monthlyTotal.toLocaleString()}</Typography>
                <LinearProgress variant="determinate" value={monthlyProgress} sx={{ my: 1, width: '80%', bgcolor: 'white' }} />
                <Typography variant="body2">{monthlyProgress.toFixed(1)}% 달성</Typography>
            </Box>
        </Card>
    );
};

export default MonthlyStepsCard;
