import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { leaveChallenge as leaveChallengeAPI, deleteChallengeAPI, updateChallengeAchievement } from '../../api/challenges'; // API 호출 함수 임포트
import { useAuth } from '../../context/AuthContext'; // 사용자 인증 정보 가져오기

const CurrentChallengesList = ({ currentChallenges, completedChallenges, openChallengeDetail, completeChallenge, deleteChallenge }) => {
  const { userObject } = useAuth(); // 현재 로그인한 사용자 정보 가져오기
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar 상태 관리
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar 메시지 관리
  const [dialogOpen, setDialogOpen] = useState(false); // 경고창 상태 관리
  const [challengeToDelete, setChallengeToDelete] = useState(null); // 삭제할 챌린지 저장

  const handleLeaveChallenge = async (index, challenge) => {
    // 챌린지를 만든 사람이 현재 사용자와 동일한지 확인
    if (challenge.createdUserId === userObject?.userId) {
      // 경고창 띄우기
      setChallengeToDelete({ index, challengeId: challenge.challengeId });
      setDialogOpen(true);
    } else {
      try {
        await leaveChallengeAPI(challenge.challengeId, userObject?.userId); // API 호출로 챌린지에서 제거
        deleteChallenge(index); // 성공적으로 제거한 경우 UI 업데이트
        setSnackbarMessage('챌린지에서 나왔습니다.');
        setSnackbarOpen(true); // 챌린지 제거 성공 시 Snackbar 표시
      } catch (error) {
        console.error('Failed to leave the challenge:', error);
        setSnackbarMessage('챌린지에서 나오는 데 실패했습니다.');
        setSnackbarOpen(true); // 오류 발생 시 Snackbar 표시
      }
    }
  };

  const handleDeleteChallenge = async () => {
    if (challengeToDelete) {
      const { index, challengeId } = challengeToDelete;
      try {
        await deleteChallengeAPI(challengeId); // 챌린지 및 관련 데이터 삭제
        deleteChallenge(index); // UI에서 제거
        setSnackbarMessage('챌린지가 삭제되었습니다.');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Failed to delete the challenge:', error);
        setSnackbarMessage('챌린지 삭제에 실패했습니다.');
        setSnackbarOpen(true);
      } finally {
        setDialogOpen(false);
        setChallengeToDelete(null);
      }
    }
  };

  const handleCompleteChallenge = async (index) => {
    const challenge = currentChallenges[index];
    try {
      // 서버에 요청을 보내 achieved 상태를 업데이트
      await updateChallengeAchievement(challenge.challengeId, userObject?.userId, true);
      completeChallenge(index); // 진행 중인 챌린지 목록에서 제거
      setSnackbarMessage('챌린지를 완료했습니다.');
      setSnackbarOpen(true); // 챌린지 완료 성공 시 Snackbar 표시
    } catch (error) {
      console.error('Failed to complete the challenge:', error);
      setSnackbarMessage('챌린지를 완료하는 데 실패했습니다.');
      setSnackbarOpen(true); // 오류 발생 시 Snackbar 표시
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Snackbar 닫기
  };

  const handleDialogClose = () => {
    setDialogOpen(false); // 경고창 닫기
    setChallengeToDelete(null);
  };

  return (
    <Grid container spacing={2}>
      {/* 현재 진행 중인 챌린지 카드 */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>현재 진행 중인 챌린지</Typography>
            <List>
              {currentChallenges.map((challenge, index) => (
                <ListItem key={index} button onClick={() => openChallengeDetail(challenge)}>
                  <Checkbox
                    edge="start"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompleteChallenge(index);
                    }}
                  />
                  <ListItemText
                    primary={challenge.challengeType}  // 챌린지 이름 대신 challengeType을 사용
                    secondary={`기간: ${challenge.startDate} ~ ${challenge.endDate}`}  // 기간을 표시
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLeaveChallenge(index, challenge); // 챌린지에서 제거 처리
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* 완료된 챌린지 카드 */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>완료된 챌린지</Typography>
            <List>
              {completedChallenges.map((challenge, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={challenge.challengeType}  // 챌린지 이름 대신 challengeType을 사용
                    secondary={`기간: ${challenge.startDate} ~ ${challenge.endDate}`}  // 기간을 표시
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* 챌린지 제거 성공/실패 시 표시될 Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* 챌린지 삭제 경고창 */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle>챌린지 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            만든 사람이 챌린지를 나올 경우 챌린지가 삭제됩니다. 계속하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            취소
          </Button>
          <Button onClick={handleDeleteChallenge} color="secondary">
            네
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default CurrentChallengesList;
