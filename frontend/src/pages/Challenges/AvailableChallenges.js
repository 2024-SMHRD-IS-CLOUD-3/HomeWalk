import React from 'react';
import { Card, CardContent, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { joinChallenge as joinChallengeAPI } from '../../api/challenges'; // API 호출 함수 임포트
import { useAuth } from '../../context/AuthContext'; // 사용자 인증 정보 가져오기

const AvailableChallenges = ({ otherChallenges, onChallengeJoined, openChallengeDetail }) => {
  const { userObject } = useAuth(); // 현재 로그인한 사용자 정보 가져오기

  const handleJoinChallenge = async (challenge) => {
    try {
      console.log('challenge', challenge);
      await joinChallengeAPI(challenge.challengeId, userObject?.userId); // API 호출로 참여자 등록
      onChallengeJoined(challenge); // 성공적으로 참여한 경우 UI 업데이트
    } catch (error) {
      console.error('Failed to join the challenge:', error);
      // 사용자에게 실패 메시지 표시 (옵션)
    }
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
                <TableRow key={challenge.id}>
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
    </Card>
  );
};

export default AvailableChallenges;
