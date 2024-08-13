import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { getLeaderboardData, updateLeaderboard } from '../../api/leaderBoard'; // API 호출 함수
import { useAuth } from '../../context/AuthContext';

export default function Ranking() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserRanking, setCurrentUserRanking] = useState(null);
  const { userObject } = useAuth(); // 현재 로그인한 사용자 정보 가져오기

  const fetchLeaderboardData = useCallback(async () => {
    if (!userObject) return; // userObject가 null인 경우, 데이터 요청 중단
    try {
      const data = await getLeaderboardData(userObject.userId);
      const top3 = data.top3.slice(0, 3);
      setLeaderboard(top3);
      setCurrentUserRanking(data.currentUser);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  }, [userObject]); // userObject를 의존성으로 추가

  const updateLeaderboardData = useCallback(async () => {
    if (!userObject) return; // userObject가 null인 경우, 업데이트 중단
    try {
      await updateLeaderboard(); // 리더보드 업데이트 호출
      fetchLeaderboardData(); // 업데이트 후 리더보드 데이터 가져오기
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  }, [fetchLeaderboardData, userObject]); // userObject를 의존성으로 추가

  useEffect(() => {
    // 초기 데이터 로드
    fetchLeaderboardData();
    updateLeaderboardData(); // 초기 업데이트 호출

    // 10초마다 데이터 갱신
    const intervalId = setInterval(() => {
      updateLeaderboardData();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [fetchLeaderboardData, updateLeaderboardData]); // 의존성 배열에 추가

  return (
    <Grid item xs={12} md={4}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          전체 랭킹
        </Typography>
        {leaderboard.map((user, index) => (
          <Typography key={index} component="p" variant="body1">
            {index + 1}. {user.username}: <strong>{user.totalSteps.toLocaleString()} 걸음</strong>
          </Typography>
        ))}
        {currentUserRanking && (
          <>
            <hr />
            <Typography component="p" variant="body1">
              <strong>{currentUserRanking.ranking}. {currentUserRanking.username}: {currentUserRanking.totalSteps.toLocaleString()} 걸음 (내 순위)</strong>
            </Typography>
          </>
        )}
      </Paper>
    </Grid>
  );
}
