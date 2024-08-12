import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';

const StepsComparisonChart = ({ currentWeekData, previousWeekData }) => (
    <Card>
        <CardContent>
            <Typography variant="h6" gutterBottom>주간 걸음 수 비교</Typography>
            <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={currentWeekData.map((data, index) => ({
                        day: data.day,
                        current: data.steps,
                        previous: previousWeekData[index].steps,
                    }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="current" fill="#8884d8" name="이번 주 걸음 수">
                            <LabelList dataKey="current" position="top" style={{ fill: '#8884d8', fontWeight: 'bold' }} />
                        </Bar>
                        <Bar dataKey="previous" fill="#82ca9d" name="저번 주 걸음 수">
                            <LabelList dataKey="previous" position="top" style={{ fill: '#82ca9d', fontWeight: 'bold' }} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </CardContent>
    </Card>
);

export default StepsComparisonChart;
