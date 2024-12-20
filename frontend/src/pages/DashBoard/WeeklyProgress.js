import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getFamilyData } from '../../api/family'; // 가족 정보를 가져오는 API 함수
import { getWeeklyStepsData } from '../../api/getStepsData'; // 주간 걸음 수 데이터를 가져오는 API 함수
import { useAuth } from '../../context/AuthContext';

// X축을 요일 순으로 정렬하기 위한 요일 배열
const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export default function WeeklyProgress() {
  const [weeklyData, setWeeklyData] = useState([]);
  const { userObject } = useAuth();

  useEffect(() => {
    if (!userObject || !userObject.userId) {
      console.error("User is not logged in or userId is missing");
      return;
    }

    // 1. 가족 구성원 정보 가져오기
    getFamilyData(userObject.userId)
      .then(familyData => {
        const userIds = familyData.memberDetails.map(member => member.userId);

        // 2. 각 구성원의 주간 걸음 수 데이터를 가져와서 상태에 저장
        return Promise.all(userIds.map(userId =>
          getWeeklyStepsData(userId).then(weeklySteps => {
            return {
              userId: userId,
              username: familyData.memberDetails.find(member => member.userId === userId).username, // 구성원의 이름 가져오기
              steps: weeklySteps.map(day => ({
                day: day.dayOfWeek, // 요일 정보
                steps: day.stepsCount
              }))
            };
          })
        ));
      })
      .then(data => {
        // 데이터가 비어있는 경우 기본값으로 처리
        const completeData = data.map(memberData => ({
          ...memberData,
          steps: daysOfWeek.map(day => ({
            day: day,
            steps: memberData.steps.find(step => step.day === day)?.steps || 0 // 데이터가 없으면 0으로 채움
          }))
        }));

        setWeeklyData(completeData);
      })
      .catch(error => {
        console.error('Error fetching weekly steps data:', error);
      });
  }, [userObject]);

  // 고정 색상 팔레트
  const colorPalette = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#d0ed57', '#8dd1e1'];

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
          주간 진행 상황
        </Typography>
        <ResponsiveContainer>
          <LineChart>
            <XAxis dataKey="day" type="category" allowDuplicatedCategory={false} />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            {weeklyData.map((memberData, index) => (
              <Line
                key={index}
                type="monotone"
                data={memberData.steps.sort((a, b) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day))} // 요일 순으로 정렬
                dataKey="steps"
                name={memberData.username} // 구성원의 이름을 범례로 사용
                stroke={colorPalette[index % colorPalette.length]} // 고정 색상 할당
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Grid>
  );
}
