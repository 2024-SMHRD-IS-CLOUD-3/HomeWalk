import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const StepsComparisonChart = ({ currentWeekData = [], previousWeekData = [] }) => {
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    const formattedCurrentWeekData = currentWeekData.length > 0 ? currentWeekData : daysOfWeek.map(day => ({ day, steps: 0 }));
    const formattedPreviousWeekData = previousWeekData.length > 0 ? previousWeekData : daysOfWeek.map(day => ({ day, steps: 0 }));

    const mergedData = formattedCurrentWeekData.map((current, index) => ({
        day: current.day,
        currentWeekSteps: current.steps,
        previousWeekSteps: formattedPreviousWeekData[index] ? formattedPreviousWeekData[index].steps : 0
    }));

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>주간 걸음 수 비교</Typography>
                <Box sx={{ height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={mergedData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="currentWeekSteps" fill="#8884d8" name="이번 주" />
                            <Bar dataKey="previousWeekSteps" fill="#82ca9d" name="저번 주" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
};

export default StepsComparisonChart;