import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchScoreData } from '../api/postureApi'; // 점수 데이터 가져오는 API 호출

const PostureScore = ({ userId, username }) => {
  const [scoreData, setScoreData] = useState([]);

  useEffect(() => {
    const getScoreData = async () => {
      if (userId) {
        try {
          const data = await fetchScoreData(userId);
          console.log('data', data);
          
          setScoreData(data);
        } catch (error) {
          console.error('Failed to fetch score data:', error);
        }
      }
    };

    getScoreData();
  }, [userId]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {username ? `${username}님의` : ''} 일별 점수 변화량
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={scoreData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="recordDate" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PostureScore;
