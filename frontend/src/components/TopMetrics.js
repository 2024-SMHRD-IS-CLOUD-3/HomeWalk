import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { DirectionsWalk, TrendingUp, Update } from '@mui/icons-material';

const metricsData = [
  { name: '김관웅', steps: 10000, color: 'primary', trend: '어제보다 2,000 걸음 많음' },
  { name: '임현진', steps: 9000, color: 'secondary', trend: '어제보다 3% 증가' },
  { name: '배지환', steps: 8000, color: 'success', trend: '어제보다 1% 증가' },
  { name: '박규민', steps: 7000, color: 'warning', trend: '최근 업데이트' },
];

export default function TopMetrics() {
  return (
    <Grid container spacing={3}>
      {metricsData.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ bgcolor: `${metric.color}.light`, color: `${metric.color}.contrastText` }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: `${metric.color}.dark` }}>
                  <DirectionsWalk />
                </Avatar>
              }
              title={metric.name}
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {metric.steps.toLocaleString()}
              </Typography>
              <Typography variant="subtitle1">걸음</Typography>
              <LinearProgress variant="determinate" value={(metric.steps / 10000) * 100} sx={{ my: 1, height: 10, borderRadius: 5 }} />
              <Typography sx={{ mt: 1, display: 'flex', alignItems: 'center' }} variant="body2">
                {metric.trend === '최근 업데이트' ? <Update sx={{ mr: 1 }} fontSize="small" /> : <TrendingUp sx={{ mr: 1 }} fontSize="small" />}
                {metric.trend}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}