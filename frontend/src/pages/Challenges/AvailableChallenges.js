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
);

export default AvailableChallenges;
