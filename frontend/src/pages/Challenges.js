import React, { useState } from 'react';
import { Box, Toolbar, Typography, Button, Grid } from '@mui/material';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';
import { Add } from '@mui/icons-material';

import { useDrawer } from '../context/DrawerContext';
import CurrentChallengesList from './Challenges/CurrentChallengesList';
import PastChallengesList from './Challenges/PastChallengesList';
import ChallengeModal from './Challenges/ChallengeModal';
import { createChallenge } from '../api/challenges'; // createChallenge API 함수 임포트
import AvailableChallenges from './Challenges/AvailableChallenges'; // AvailableChallenges 컴포넌트 임포트

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
  const [pastChallenges, setPastChallenges] = useState([]);
  const [otherChallenges, setOtherChallenges] = useState([]);

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
          <Grid item xs={12} md={6}>
            <CurrentChallengesList
              currentChallenges={currentChallenges}
              openChallengeDetail={() => {}}
              completeChallenge={() => {}}
              deleteChallenge={() => {}}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <PastChallengesList
              pastChallenges={pastChallenges}
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
