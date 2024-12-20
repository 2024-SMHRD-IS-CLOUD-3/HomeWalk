import React, { useState } from 'react';
import { Card, CardContent, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Snackbar, Alert } from '@mui/material';
import { joinChallenge as joinChallengeAPI } from '../../api/challenges'; // API 호출 함수 임포트
import { useAuth } from '../../context/AuthContext'; // 사용자 인증 정보 가져오기

const AvailableChallenges = ({ otherChallenges, loadChallenges, openChallengeDetail }) => {
  const { userObject } = useAuth(); // 현재 로그인한 사용자 정보 가져오기
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar 상태 관리

  const handleJoinChallenge = async (challenge) => {
    try {
      await joinChallengeAPI(challenge.challengeId, userObject?.userId); // API 호출로 참여자 등록
      loadChallenges(); // 참여 후 데이터 새로 불러오기
      setSnackbarOpen(true); // 챌린지 참여 성공 시 Snackbar 표시
    } catch (error) {
      console.error('Failed to join the challenge:', error);
      // 사용자에게 실패 메시지 표시 (옵션)
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Snackbar 닫기
  };

  return (
    <Card sx={{ mt: 2 }}>
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
                <TableRow key={challenge.challengeId}>
                  <TableCell>
                    <Button onClick={() => openChallengeDetail(challenge)}>
                      {challenge.challengeType} {/* 챌린지 타입을 이름 대신 사용 */}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {challenge.createdBy} {/* 만든 사람 표시 */}
                  </TableCell>
                  <TableCell>
                    {Array.isArray(challenge.participants) ? challenge.participants.length : 0} {/* 참가자 수를 배열 길이로 표시 */}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleJoinChallenge(challenge)} // 클릭 시 참여 처리
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

      {/* 챌린지 참여 성공 시 표시될 Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          챌린지에 참여하였습니다.
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default AvailableChallenges;
