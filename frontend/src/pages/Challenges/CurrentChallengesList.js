import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox } from '@mui/material';
import { Delete } from '@mui/icons-material';

const CurrentChallengesList = ({ currentChallenges, openChallengeDetail, completeChallenge, deleteChallenge }) => (
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
                completeChallenge(index);
              }}
            />
            <ListItemText
              primary={challenge.challengeType}  // 챌린지 이름 대신 challengeType을 사용
              secondary={`기간: ${challenge.startDate} ~ ${challenge.endDate}`}  // 기간과 목표, 보상을 표시
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
);

export default CurrentChallengesList;
