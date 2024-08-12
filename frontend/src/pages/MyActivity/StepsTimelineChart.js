import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const StepsTimelineChart = ({ todayStepsData }) => (
    <Card>
        <CardContent>
            <Typography variant="h6" gutterBottom>걸음수 타임라인</Typography>
            <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={todayStepsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" interval={3} tickFormatter={(time) => time.split(':')[0]} />
                        <YAxis />
                        <Tooltip labelFormatter={(label) => `시간: ${label}`} formatter={(value) => [`${value} 걸음`, '걸음 수']} />
                        <Line type="monotone" dataKey="steps" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </CardContent>
    </Card>
);

export default StepsTimelineChart;
