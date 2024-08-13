import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';


const StepsTimelineChart = ({ todayStepsData = [] }) => {
    // todayStepsData가 비어있을 경우 기본값 설정
    const defaultData = [{ time: 'N/A', steps: 0 }];
    const data = todayStepsData.length > 0 ? todayStepsData : defaultData;

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>걸음 수 타임라인</Typography>
                <Box sx={{ height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="steps" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
};

export default StepsTimelineChart;