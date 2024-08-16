import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getFamilyData } from '../../api/family'; // 가족 정보를 가져오는 API 함수
import { getWeeklyStepsData } from '../../api/getStepsData'; // 주간 걸음 수 데이터를 가져오는 API 함수
import { getWeeklyFamilyGoals } from '../../api/familyGoals'; // 주간 목표 데이터를 가져오는 API 함수
import { useAuth } from '../../context/AuthContext';

export default function FamilyGoalChart() {
  const [goalData, setGoalData] = useState([]);
  const { userObject } = useAuth(); // AuthContext에서 userId를 가져옴

  useEffect(() => {
    if (!userObject || !userObject.userId) {
      console.error("User is not logged in or userId is missing");
      return;
    }

    // 1. 가족 구성원 정보 가져오기
    getFamilyData(userObject.userId)
      .then(familyData => {
        const userIds = familyData.memberDetails.map(member => member.userId);
        // 2. 각 구성원의 주간 목표 데이터 가져오기
        return getWeeklyFamilyGoals(userIds).then(goals => {
          // 3. 주간 걸음 수 데이터를 가져와서 합산
          return Promise.all(userIds.map(userId =>
            getWeeklyStepsData(userId).then(weeklySteps => {
              const totalSteps = weeklySteps.reduce((sum, day) => {
                // stepsCount 속성이 존재하고 유효한 숫자인지 확인
                const steps = day.stepsCount && !isNaN(day.stepsCount) ? day.stepsCount : 0;
                return sum + steps;
              }, 0); // 주간 걸음 수 합계 계산
              
              const goal = goals.find(g => g.userId === userId);

              return {
                name: familyData.memberDetails.find(member => member.userId === userId).username, // 구성원 이름
                goal: goal ? goal.goalValue : 0, // 목표 걸음 수
                current: totalSteps, // 주간 걸음 수 합계
              };
            })
          ));
        });
      })
      .then(data => {
        setGoalData(data);
      })
      .catch(error => {
        console.error('Error fetching family goal data:', error);
      });
  }, [userObject]);

  return (
    <Grid item xs={12} md={4} lg={6}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 300,
        }}
      >
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          가족 주간 목표 달성 비교
        </Typography>
        <ResponsiveContainer>
          <BarChart
            data={goalData}
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
