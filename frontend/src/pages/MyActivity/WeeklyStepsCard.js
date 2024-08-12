import React from 'react';
import { Box, Card, Typography, LinearProgress } from '@mui/material';

const WeeklyStepsCard = ({ currentWeekData, weeklyGoal }) => {
    const currentWeeklyTotal = currentWeekData.reduce((sum, day) => sum + day.steps, 0);
    const weeklyProgress = (currentWeeklyTotal / weeklyGoal) * 100;

    return (
        <Card>
            <Box
                sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: '#FFBB28',
                    '&:hover': {
                        bgcolor: '#FFA726',
                    },
                    color: 'white',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h6">이번 주 총 걸음 수</Typography>
                <Typography variant="h4">{currentWeeklyTotal.toLocaleString()}</Typography>
                <LinearProgress variant="determinate" value={weeklyProgress} sx={{ my: 1, width: '80%', bgcolor: 'white' }} />
                <Typography variant="body2">{weeklyProgress.toFixed(1)}% 달성</Typography>
            </Box>
        </Card>
    );
};

export default WeeklyStepsCard;
