import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox } from '@mui/material';
import { fetchCurrentChallenges, updateChallengeAchievement } from '../../api/challenges'; // API 호출 함수
import { useAuth } from '../../context/AuthContext';

export default function ChallengeList() {
  const [challenges, setChallenges] = useState([]);
  const [checked, setChecked] = useState([]);
  const { userObject } = useAuth(); // AuthContext에서 userId를 가져옴

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const challengeData = await fetchCurrentChallenges(userObject?.userId);
        setChallenges(challengeData); // API에서 받은 도전 과제 목록을 설정
      } catch (error) {
        console.error('Failed to load challenges:', error);
      }
    };

    loadChallenges();
  }, [userObject?.userId]);

  const handleToggle = (challengeId) => async () => {
    const currentIndex = checked.indexOf(challengeId);
    const newChecked = [...checked];
    const isChecked = currentIndex === -1;

    if (isChecked) {
      newChecked.push(challengeId);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);

    try {
      await updateChallengeAchievement(challengeId, userObject.userId, isChecked);
      // 상태가 성공적으로 업데이트되었을 경우 도전 과제 목록을 다시 불러옵니다.
      const challengeData = await fetchCurrentChallenges(userObject?.userId);
      setChallenges(challengeData);
    } catch (error) {
      console.error('Failed to update challenge achievement', error);
    }
  };

  return (
    <Grid item xs={12} md={4}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          챌린지 목록
        </Typography>
        <List>
          {challenges.map((challenge) => (
            <ListItem key={challenge.challengeId} disablePadding sx={{ pl: 0, pr: 0 }}>
              <ListItemButton
                role={undefined}
                onClick={handleToggle(challenge.challengeId)}
                dense
                sx={{ pl: 1, pr: 1 }}
              >
                <ListItemIcon sx={{ minWidth: '36px' }}>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(challenge.challengeId) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': `checkbox-list-label-${challenge.challengeId}` }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={`checkbox-list-label-${challenge.challengeId}`}
                  primary={
                    <Typography variant="body2">
                      {challenge.challengeType}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Grid>
  );
}
