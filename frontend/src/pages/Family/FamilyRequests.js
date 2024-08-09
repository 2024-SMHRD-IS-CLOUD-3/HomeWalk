import React from 'react';
import { Typography, Paper, Grid } from '@mui/material';

const FamilyRequests = () => {
  return (
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          가입 신청 관리
        </Typography>
        {/* 가입 신청 관리 기능을 여기에 구현하세요 */}
      </Paper>
    </Grid>
  );
};

export default FamilyRequests;
