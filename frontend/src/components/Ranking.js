import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

export default function Ranking() {
  return (
    <Grid item xs={12} md={4}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          8월 랭킹
        </Typography>
        <Typography component="p" variant="body1">1. 관웅Fam: 50,000 걸음</Typography>
        <Typography component="p" variant="body1">2. 현진Fam: 33,000 걸음</Typography>
        <Typography component="p" variant="body1">3. 지환Fam: 30,000 걸음 (100% 달성)</Typography>
      </Paper>
    </Grid>
  );
}