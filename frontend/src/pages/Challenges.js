import React, { useState } from 'react';
import {
  Box, Toolbar, Card, CardContent, Typography, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Modal, TextField, Grid, Autocomplete, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox
} from '@mui/material';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';
import { Add, Delete } from '@mui/icons-material';

import { useDrawer } from '../context/DrawerContext'; // 드로어 상태 가져오기

const Challenges = () => {
  const { open, toggleDrawer } = useDrawer();
  const [challengeOpen, challengeSetOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [newChallenge, setNewChallenge] = useState({ 
    name: '', 
    content: '', 
    startDate: '', 
    endDate: '', 
    invitedUsers: []
  });
  

  // 현재 진행 중인 챌린지
  const [currentChallenges, setCurrentChallenges] = useState([
    { name: '매일 만보 걷기', content: '하루에 10,000보 걷기', startDate: '2023-08-01', endDate: '2023-08-31' },
    { name: '주 3회 운동하기', content: '일주일에 3번 30분 이상 운동하기', startDate: '2023-08-01', endDate: '2023-08-31' },
    { name: '한 달 동안 체중 3kg 감량', content: '한 달 동안 체중 3kg 감량하기', startDate: '2023-08-01', endDate: '2023-08-31' }
  ]);

  // 과거 챌린지 예시 데이터
  const [pastChallenges, setPastChallenges] = useState([
    { name: '30일 플랭크 챌린지', result: '성공', date: '2023-04-01' },
    { name: '1주일 아침 운동', result: '실패', date: '2023-05-15' },
    { name: '한 달 명상하기', result: '성공', date: '2023-06-30' },
    { name: '2주 동안 단 음식 끊기', result: '성공', date: '2023-07-14' }
  ]);

  // 다른 사람이 만든 챌린지 목록
  const [otherChallenges, setOtherChallenges] = useState([
    { id: 1, name: '50일 윗몸일으키기', creator: '홍길동', participants: 15, content: '50일 동안 매일 50개씩 윗몸일으키기', startDate: '2023-09-01', endDate: '2023-10-20' },
    { id: 2, name: '2주 동안 하루 2L 물 마시기', creator: '김철수', participants: 8, content: '2주 동안 매일 2L의 물 마시기', startDate: '2023-09-15', endDate: '2023-09-29' },
    { id: 3, name: '3개월 독서 챌린지', creator: '이영희', participants: 20, content: '3개월 동안 매월 2권씩 책 읽기', startDate: '2023-09-01', endDate: '2023-11-30' }
  ]);

  // 사용자 목록 (초대용)
  const users = [
    { name: '홍길동' },
    { name: '김철수' },
    { name: '이영희' },
    { name: '박지성' }
  ];

  const handleOpen = () => challengeSetOpen(true);
  const handleClose = () => {
    challengeSetOpen(false);
    setNewChallenge({ name: '', content: '', startDate: '', endDate: '', invitedUsers: [] });
  };

  const handleNewChallenge = (e) => {
    setNewChallenge({ ...newChallenge, [e.target.name]: e.target.value });
  };

  const handleUserInvite = (event, newValue) => {
    setNewChallenge({ ...newChallenge, invitedUsers: newValue });
  };

  const submitNewChallenge = () => {
    setCurrentChallenges([...currentChallenges, newChallenge]);
    handleClose();
  };

  const deleteChallenge = (index) => {
    const updatedChallenges = currentChallenges.filter((_, i) => i !== index);
    setCurrentChallenges(updatedChallenges);
  };

  const joinChallenge = (challenge) => {
    // 현재 진행 중인 챌린지에 추가
    setCurrentChallenges([...currentChallenges, {
      name: challenge.name,
      content: challenge.content,
      startDate: challenge.startDate,
      endDate: challenge.endDate
    }]);
    
    // 참여 가능한 챌린지 목록에서 제거
    const updatedOtherChallenges = otherChallenges.filter(c => c.id !== challenge.id);
    setOtherChallenges(updatedOtherChallenges);
  };

  const openChallengeDetail = (challenge) => {
    setSelectedChallenge(challenge);
    setDetailOpen(true);
  };

  const completeChallenge = (index) => {
    const challenge = currentChallenges[index];
    const updatedCurrentChallenges = currentChallenges.filter((_, i) => i !== index);
    setCurrentChallenges(updatedCurrentChallenges);
    setPastChallenges([...pastChallenges, { ...challenge, result: '성공', date: new Date().toISOString().split('T')[0] }]);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBarComponent open={open} toggleDrawer={toggleDrawer} />
      <DrawerComponent open={open} toggleDrawer={toggleDrawer} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
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
          {/* 현재 진행 중인 챌린지 */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>현재 진행 중인 챌린지</Typography>
                <List>
                  {currentChallenges.map((challenge, index) => (
                    <ListItem 
                      key={index} 
                      button 
                      onClick={() => openChallengeDetail(challenge)}
                    >
                      <Checkbox
                        edge="start"
                        onClick={(e) => {
                          e.stopPropagation();
                          completeChallenge(index);
                        }}
                      />
                      <ListItemText 
                        primary={challenge.name} 
                        secondary={`${challenge.startDate} ~ ${challenge.endDate}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={(e) => {
                          e.stopPropagation();
                          deleteChallenge(index);
                        }}>
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* 과거 챌린지 */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>과거 챌린지</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>챌린지 이름</TableCell>
                        <TableCell align="right">결과</TableCell>
                        <TableCell align="right">날짜</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pastChallenges.map((challenge, index) => (
                        <TableRow key={index}>
                          <TableCell>{challenge.name}</TableCell>
                          <TableCell align="right">{challenge.result}</TableCell>
                          <TableCell align="right">{challenge.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* 다른 사람이 만든 챌린지 목록 */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>참여 가능한 챌린지</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>챌린지 이름</TableCell>
                        <TableCell>만든 사람</TableCell>
                        <TableCell>참여자 수</TableCell>
                        <TableCell>참여하기</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {otherChallenges.map((challenge) => (
                        <TableRow key={challenge.id}>
                          <TableCell>
                            <Button onClick={() => openChallengeDetail(challenge)}>
                              {challenge.name}
                            </Button>
                          </TableCell>
                          <TableCell>{challenge.creator}</TableCell>
                          <TableCell>{challenge.participants}</TableCell>
                          <TableCell>
                            <Button 
                              variant="contained" 
                              color="primary" 
                              onClick={() => joinChallenge(challenge)}
                            >
                              참여하기
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 새로운 챌린지 생성 모달 */}
        <Modal
          open={challengeOpen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}>
            <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
              새로운 챌린지 생성
            </Typography>
            <TextField
              fullWidth
              label="챌린지 이름"
              name="name"
              value={newChallenge.name}
              onChange={handleNewChallenge}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="내용"
              name="content"
              value={newChallenge.content}
              onChange={handleNewChallenge}
              margin="normal"
              multiline
              rows={4}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="시작 날짜"
              name="startDate"
              type="date"
              value={newChallenge.startDate}
              onChange={handleNewChallenge}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="종료 날짜"
              name="endDate"
              type="date"
              value={newChallenge.endDate}
              onChange={handleNewChallenge}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              variant="outlined"
            />
            <Autocomplete
              multiple
              id="invite-users"
              options={users}
              getOptionLabel={(option) => option.name}
              value={newChallenge.invitedUsers}
              onChange={handleUserInvite}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="유저 초대"
                  placeholder="유저 선택"
                  margin="normal"
                />
              )}
            />
            <Button onClick={submitNewChallenge} variant="contained" sx={{ mt: 2 }}>
              챌린지 생성
            </Button>
          </Box>
        </Modal>

        {/* 챌린지 상세 정보 모달 */}
        <Modal
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          aria-labelledby="challenge-detail-title"
          aria-describedby="challenge-detail-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}>
            {selectedChallenge && (
              <>
                <Typography id="challenge-detail-title" variant="h6" component="h2" gutterBottom>
                  {selectedChallenge.name}
                </Typography>
                <Typography id="challenge-detail-description" sx={{ mt: 2 }}>
                  {selectedChallenge.content}
                </Typography>
                {selectedChallenge.creator && (
                  <Typography sx={{ mt: 2 }}>
                    만든 사람: {selectedChallenge.creator}
                  </Typography>
                )}
                {selectedChallenge.participants && (
                  <Typography>
                    참여자 수: {selectedChallenge.participants}
                  </Typography>
                )}
                <Typography sx={{ mt: 2 }}>
                  시작 날짜: {selectedChallenge.startDate}
                </Typography>
                <Typography>
                  종료 날짜: {selectedChallenge.endDate}
                </Typography>
              </>
            )}
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default Challenges;
