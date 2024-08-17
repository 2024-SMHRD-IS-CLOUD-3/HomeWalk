import React, { useState, useEffect } from 'react';
import { Box, Toolbar, Typography, Button, Grid } from '@mui/material';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';
import { Add } from '@mui/icons-material';

import { useDrawer } from '../context/DrawerContext';
import CurrentChallengesList from './Challenges/CurrentChallengesList';
import ChallengeModal from './Challenges/ChallengeModal';
import AvailableChallenges from './Challenges/AvailableChallenges';
import { createChallenge, fetchCurrentChallenges, fetchAvailableChallenges } from '../api/challenges'; // API 호출 함수 임포트

import { useAuth } from '../context/AuthContext';

const Challenges = () => {
  const { userObject } = useAuth();
  const { open, toggleDrawer } = useDrawer();
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    name: '',
    content: '',
    startDate: '',
    endDate: ''
  });

  const [currentChallenges, setCurrentChallenges] = useState([]);
  const [otherChallenges, setOtherChallenges] = useState([]);

  // 챌린지 데이터를 가져오는 useEffect
  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const current = await fetchCurrentChallenges(userObject?.userId);
        const available = await fetchAvailableChallenges(userObject?.userId);
        setCurrentChallenges(current);
        setOtherChallenges(available);
      } catch (error) {
        console.error('챌린지 데이터를 불러오는 데 실패했습니다:', error);
      }
    };

    loadChallenges();
  }, [userObject?.userId]);

  // 챌린지 모달 열기/닫기
  const handleOpen = () => setChallengeOpen(true);
  const handleClose = () => {
    setChallengeOpen(false);
    setNewChallenge({ name: '', content: '', startDate: '', endDate: '' });
  };

  // 새로운 챌린지 입력 처리
  const handleNewChallenge = (e) => {
    setNewChallenge({ ...newChallenge, [e.target.name]: e.target.value });
  };

  // 새로운 챌린지 생성
  const submitNewChallenge = async () => {
    console.log(newChallenge);
    try {
      const challengeData = {
        challengeType: newChallenge.name, // 챌린지 이름을 타입으로 사용
        goalValue: 10000, // 목표 값을 예시로 설정
        startDate: newChallenge.startDate,
        endDate: newChallenge.endDate,
        reward: '참여자 보상', // 보상을 예시로 설정
        createdUserId : userObject?.userId,
        createdBy: userObject?.username, // 만든 사람을 예시로 설정 (로그인 시스템 연동 시 수정 필요)
      };

      const createdChallenge = await createChallenge(challengeData);

      // 생성된 챌린지를 현재 챌린지 목록에 추가
      setCurrentChallenges([...currentChallenges, createdChallenge]);
      handleClose();
    } catch (error) {
      console.error('챌린지 생성 실패:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AppBarComponent open={open} toggleDrawer={toggleDrawer} />
      <DrawerComponent open={open} toggleDrawer={toggleDrawer} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          overflowY: 'auto',
          width: { sm: `calc(100% - ${240}px)` },
        }}
      >
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          챌린지
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpen}
          sx={{ mb: 2 }}
        >
          새로운 챌린지 생성
        </Button>

        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <CurrentChallengesList
              currentChallenges={currentChallenges}
              openChallengeDetail={() => {}}
              completeChallenge={() => {}}
              deleteChallenge={() => {}}
            />
          </Grid>
          <Grid item xs={12}>
            <AvailableChallenges
              otherChallenges={otherChallenges}
              joinChallenge={() => {}}
              openChallengeDetail={() => {}}
            />
          </Grid>
        </Grid>

        <ChallengeModal
          challengeOpen={challengeOpen}
          handleClose={handleClose}
          newChallenge={newChallenge}
          handleNewChallenge={handleNewChallenge}
          submitNewChallenge={submitNewChallenge}
        />
      </Box>
    </Box>
  );
};

export default Challenges;
