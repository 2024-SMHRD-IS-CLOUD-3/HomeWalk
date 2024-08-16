import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';
import Copyright from '../components/Copyright';
import TopMetrics from './DashBoard/TopMetrics';
import FamilyGoalChart from './DashBoard/FamilyGoalChart';
import WeeklyProgress from './DashBoard/WeeklyProgress';
import Ranking from './DashBoard/Ranking';
import FamilyWeeklyGoal from './DashBoard/FamilyWeeklyGoal';
import ChallengeList from './DashBoard/ChallengeList';

import { useDrawer } from '../context/DrawerContext'; // 드로어 상태 가져오기

export default function Dashboard() {
  const { open, toggleDrawer } = useDrawer();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarComponent open={open} toggleDrawer={toggleDrawer} />
      <DrawerComponent open={open} toggleDrawer={toggleDrawer} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth={false} sx={{ mt: 4, mb: 4, px: 0 }}>
          <Grid container spacing={3}>
            <TopMetrics />
            <FamilyGoalChart />
            <WeeklyProgress />
            <Ranking />
            <FamilyWeeklyGoal />
            <ChallengeList />
          </Grid>
          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>
    </Box>
  );
}
