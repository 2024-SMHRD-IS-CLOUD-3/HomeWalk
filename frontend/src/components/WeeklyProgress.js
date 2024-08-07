import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const weeklyData = [
  { day: '월', steps: 8000 },
  { day: '화', steps: 6000 },
  { day: '수', steps: 7000 },
  { day: '목', steps: 6500 },
  { day: '금', steps: 9000 },
  { day: '토', steps: 7500 },
  { day: '일', steps: 10000 },
];

export default function WeeklyProgress() {
  return (
    <Grid item xs={12} md={4} lg={3}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 300,
        }}
      >
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          주간 진행 상황
        </Typography>
        <ResponsiveContainer>
          <LineChart data={weeklyData}>
            <XAxis dataKey="day" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Line type="monotone" dataKey="steps" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Grid>
  );
}