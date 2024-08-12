import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const familyWeeklyGoalData = [
  { name: '우리 가족', achievement: 85 }
];

export default function FamilyWeeklyGoal() {
  return (
    <Grid item xs={12} md={4}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          우리 가족 통합목표 달성률
        </Typography>
        <ResponsiveContainer>
          <BarChart
            data={familyWeeklyGoalData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="achievement" fill="#8884d8" name="달성률" />
          </BarChart>
        </ResponsiveContainer>
        <Typography variant="h4" color="primary" align="center">
          {familyWeeklyGoalData[0].achievement}%
        </Typography>
        <Typography color="text.secondary" align="center">
          가족 공동 목표 달성률
        </Typography>
      </Paper>
    </Grid>
  );
}