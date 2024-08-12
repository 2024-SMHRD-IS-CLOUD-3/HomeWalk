import React, { useState } from 'react';
import { Grid, Paper, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox } from '@mui/material';

const challenges = [
  { id: 1, text: '중앙 호수공원 만보 걷기' },
  { id: 2, text: '매일 아침 걷기' },
  { id: 3, text: '운전저수지에서 플로깅' },
];

export default function ChallengeList() {
  const [checked, setChecked] = useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <Grid item xs={12} md={4}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          챌린지 목록
        </Typography>
        <List>
          {challenges.map((challenge) => (
            <ListItem key={challenge.id} disablePadding>
              <ListItemButton role={undefined} onClick={handleToggle(challenge.id)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(challenge.id) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': `checkbox-list-label-${challenge.id}` }}
                  />
                </ListItemIcon>
                <ListItemText id={`checkbox-list-label-${challenge.id}`} primary={challenge.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Grid>
  );
}