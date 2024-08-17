import React from 'react';
import { Card, CardContent, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const PastChallengesList = ({ pastChallenges }) => (
  <Card sx={{ mt: 2 }}>
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
);

export default PastChallengesList;
