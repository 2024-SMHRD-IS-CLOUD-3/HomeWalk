import React, { useState } from 'react';
import { Box, Tabs, Tab, CssBaseline, Toolbar, Container } from '@mui/material';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';
import FamilyList from './Family/FamilyList';
import FamilyCreate from './Family/FamilyCreate';
import FamilyRequests from './Family/FamilyRequests';
import MyFamily from './Family/MyFamily'; // MyFamily 컴포넌트 추가

import { useDrawer } from '../context/DrawerContext'; // 드로어 상태 가져오기

const Families = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { open, toggleDrawer } = useDrawer();

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 0:
        return <FamilyList />;
      case 1:
        return <FamilyCreate />;
      case 2:
        return <FamilyRequests />;
      case 3:
        return <MyFamily />; // MyFamily 탭 추가
      default:
        return <FamilyList />;
    }
  };

  return (
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
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, pl: 2 }}>
          <Tabs value={activeTab} onChange={handleChange} aria-label="family tabs">
            <Tab label="Family List" />
            <Tab label="Create Family" />
            <Tab label="Manage Requests" />
            <Tab label="My Family" /> {/* MyFamily 탭 추가 */}
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {renderTab()}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Families;
