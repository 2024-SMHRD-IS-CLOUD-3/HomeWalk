import React from 'react';
import { Card, CardContent, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';

const AvailableChallenges = ({ otherChallenges, joinChallenge, openChallengeDetail }) => (
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
                  {challenge.creator?.username || challenge.createdBy} {/* 객체일 경우, 이름이나 사용자명을 사용 */}
                </TableCell>
                <TableCell>
                  {Array.isArray(challenge.participants) ? challenge.participants.length : 0} {/* 참가자 수를 배열 길이로 표시 */}
                </TableCell>
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
);

export default AvailableChallenges;
