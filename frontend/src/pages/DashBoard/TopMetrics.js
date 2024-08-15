import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getFamilyData } from '../../api/family';
import { getStepsComparisonData } from '../../api/getStepsData';
import { useAuth } from '../../context/AuthContext';

export default function TopMetrics() {
  const [metricsData, setMetricsData] = useState([]);
  const { userObject } = useAuth();

  useEffect(() => {
    if (!userObject || !userObject.userId) {
      console.error("User is not logged in or userId is missing");
      return;
    }

    getFamilyData(userObject.userId)
      .then(familyData => {
        return Promise.all(familyData.memberDetails.map(member =>
          getStepsComparisonData(member.userId).then(stepsData => {
            const todaySteps = stepsData.todaySteps ? stepsData.todaySteps.stepsCount : 0;
            const yesterdaySteps = stepsData.yesterdaySteps ? stepsData.yesterdaySteps.stepsCount : 0;
            const trend = yesterdaySteps > 0 ? ((todaySteps - yesterdaySteps) / yesterdaySteps) * 100 : 0;

            return {
              ...member,
              steps: todaySteps,
              trend: trend.toFixed(2),
              color: getColorBasedOnSteps(todaySteps),
              avatarError: false, // 이미지 로드 에러 상태 추가
            };
          })
        ));
      })
      .then(data => {
        setMetricsData(data);
      })
      .catch(error => {
        console.error('Error fetching metrics data:', error);
      });
  }, [userObject]);

  const handleAvatarError = (index) => {
    setMetricsData(prevMetricsData => {
      const newMetricsData = [...prevMetricsData];
      newMetricsData[index].avatarError = true; // 이미지 로드 에러 상태 업데이트
      return newMetricsData;
    });
  };

  return (
    <Grid container spacing={3} sx={{ ml: 2 }}>
      {metricsData.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ bgcolor: `${metric.color}.light`, color: `${metric.color}.contrastText` }}>
            <CardHeader
              avatar={
                !metric.avatarError && metric.avatarCustomization ? (
                  <img
                    src={metric.avatarCustomization}
                    alt="User Avatar"
                    onError={() => handleAvatarError(index)} // 이미지 로드 에러 발생 시 처리
                    style={{ width: 40, height: 40, borderRadius: '50%' }}
                  />
                ) : (
                  <Avatar sx={{ bgcolor: `${metric.color}.dark`, width: 40, height: 40 }}>
                    <AccountCircleIcon sx={{ fontSize: 30 }} />
                  </Avatar>
                )
              }
              title={metric.username}
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {metric.steps.toLocaleString()}
              </Typography>
              <Typography variant="subtitle1">걸음</Typography>
              <LinearProgress variant="determinate" value={(metric.steps / 10000) * 100} sx={{ my: 1, height: 10, borderRadius: 5 }} />
              <Typography sx={{ mt: 1, display: 'flex', alignItems: 'center' }} variant="body2">
                {metric.trend > 0 ? (
                  <>
                    <TrendingUp sx={{ mr: 1 }} fontSize="small" />
                    어제보다 {metric.trend}% 증가
                  </>
                ) : metric.trend < 0 ? (
                  <>
                    <TrendingDown sx={{ mr: 1 }} fontSize="small" />
                    어제보다 {Math.abs(metric.trend)}% 감소
                  </>
                ) : (
                  <>
                    어제와 동일한 걸음 수
                  </>
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

function getColorBasedOnSteps(steps) {
  if (steps < 2000) return 'error';
  if (steps < 4000) return 'warning';
  if (steps < 6000) return 'success';
  if (steps < 8000) return 'info';
  if (steps >= 8000) return 'secondary';
  return 'error';
}
