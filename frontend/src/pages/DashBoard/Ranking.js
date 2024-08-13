import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, CircularProgress, Divider } from '@mui/material';
import { getRankingData } from '../../api/ranking';
import { useAuth } from '../../context/AuthContext';

export default function Ranking() {
  const [rankingData, setRankingData] = useState({
    topRanking: [],
    currentUserRanking: null,
    totalUsers: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userObject } = useAuth();

  useEffect(() => {
    const fetchRankingData = async () => {
      if (!userObject || !userObject.userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getRankingData(userObject.userId);
        setRankingData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching ranking data:', error);
        setError('랭킹 정보를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRankingData();
  }, [userObject]);

  if (isLoading) {
    return (
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <CircularProgress />
        </Paper>
      </Grid>
    );
  }

  if (!userObject || !userObject.userId) {
    return (
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Typography>로그인이 필요합니다.</Typography>
        </Paper>
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      </Grid>
    );
  }

  return (
    <Grid item xs={12} md={4}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          전체 랭킹
        </Typography>
        {rankingData.topRanking.map((user, index) => (
          <Typography key={index} component="p" variant="body1">
            {user.ranking}. {user.username}: <strong>{user.totalSteps} 걸음</strong>
          </Typography>
        ))}
        <Divider sx={{ my: 2 }} />
        {rankingData.currentUserRanking && (
          <Typography component="p" variant="body1" sx={{ fontWeight: 'bold' }}>
            나의 랭킹: {rankingData.currentUserRanking.ranking}위 / {rankingData.totalUsers}명 중
            <br />
            {rankingData.currentUserRanking.username}: <strong>{rankingData.currentUserRanking.totalSteps} 걸음</strong>
          </Typography>
        )}
      </Paper>
    </Grid>
  );
}