import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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

const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBarComponent open={open} toggleDrawer={toggleDrawer} />
        <DrawerComponent open={open} toggleDrawer={toggleDrawer} />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
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
    </ThemeProvider>
  );
}
