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

    console.log(userObject.userId);

    // 1. 가족 구성원 정보 가져오기
    getFamilyData(userObject.userId)
      .then(familyData => {
        console.log(familyData);

        // 2. 각 구성원의 오늘과 어제 걸음 수 데이터 가져오기
        return Promise.all(familyData.memberDetails.map(member =>
          getStepsComparisonData(member.userId).then(stepsData => {
            const todaySteps = stepsData.todaySteps ? stepsData.todaySteps.stepsCount : 0;
            const yesterdaySteps = stepsData.yesterdaySteps ? stepsData.yesterdaySteps.stepsCount : 0;
            const trend = yesterdaySteps > 0 ? ((todaySteps - yesterdaySteps) / yesterdaySteps) * 100 : 0;

            return {
              ...member,
              steps: todaySteps,
              trend: trend.toFixed(2),
              color: getColorBasedOnSteps(todaySteps), // 걸음 수에 따른 색상 결정
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

  return (
    <Grid container spacing={3} sx={{ ml: 2 }}> {/* 왼쪽 마진 추가 */}
      {metricsData.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ bgcolor: `${metric.color}.light`, color: `${metric.color}.contrastText` }}>
            <CardHeader
              avatar={
                metric.avatarCustomization ? (
                  <img
                    src={metric.avatarCustomization}
                    alt="User Avatar"
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
                {metric.steps.toLocaleString()} {/* 오늘의 걸음 수 */}
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
                    어제와 동일한 걸음 수 {/* 트렌드가 0인 경우 */}
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

// 걸음 수에 따른 색상 결정 함수
function getColorBasedOnSteps(steps) {
  if (steps < 2000) return 'error';
  if (steps < 4000) return 'warning';
  if (steps < 6000) return 'success';
  if (steps < 8000) return 'info';
  if (steps >= 8000) return 'secondary';
  return 'error';
}
