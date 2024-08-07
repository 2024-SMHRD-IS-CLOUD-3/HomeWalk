import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const familyGoalData = [
  { name: '김관용', goal: 10000, current: 7000 },
  { name: '임현진', goal: 9000, current: 6000 },
  { name: '배지환', goal: 8000, current: 5000 },
  { name: '박규민', goal: 7000, current: 4000 },
];

export default function FamilyGoalChart() {
  return (
    <Grid item xs={12} md={8} lg={9}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 300,
        }}
      >
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          가족 목표 달성 비교
        </Typography>
        <ResponsiveContainer>
          <BarChart
            data={familyGoalData}
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
            <Bar dataKey="goal" fill="#8884d8" name="목표 걸음 수" />
            <Bar dataKey="current" fill="#82ca9d" name="현재 걸음 수" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Grid>
  );
}